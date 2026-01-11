export class FakeBooksApi {
  constructor({
    seedBooks = [],
    storageKey = 'library_books',
    delay = 400,
  } = {}) {
    this.storageKey = storageKey;
    this.delay = delay;
    this.data = [];
    this._idCounter = 0;

    const stored = this._load();
    if (Array.isArray(stored) && stored.length) {
      this.data = this._ensureIds(stored);
    } else {
      this.data = this._ensureIds(this._clone(seedBooks));
      this._save();
    }
  }

  list() {
    return this._delay(this._clone(this.data));
  }

  create(book) {
    const newBook = this._clone(book) || {};
    if (!newBook.id) newBook.id = this._nextId();
    this.data.push(newBook);
    this._save();
    return this._delay(this._clone(newBook));
  }

  update(originalBook, updatedBook) {
    const index = this._findIndex(originalBook);
    if (index === -1) return this._delay(null);

    const existing = this.data[index] || {};
    const merged = Object.assign({}, existing, this._clone(updatedBook));

    if (existing.history && !merged.history) {
      merged.history = existing.history;
    }

    if (!merged.id) merged.id = existing.id || this._nextId();

    this.data[index] = merged;
    this._save();
    return this._delay(this._clone(merged));
  }

  remove(book) {
    const index = this._findIndex(book);
    if (index === -1) return this._delay(false);
    this.data.splice(index, 1);
    this._save();
    return this._delay(true);
  }

  details(book) {
    const index = this._findIndex(book);
    const found = index === -1 ? null : this.data[index];
    return this._delay(this._clone(found));
  }

  _findIndex(book) {
    if (!book) return -1;
    if (book.id) {
      return this.data.findIndex(b => b.id === book.id);
    }
    const title = book.title || '';
    const year = book.year || '';
    return this.data.findIndex(
      b => (b.title || '') === title && (b.year || '') === year
    );
  }

  _ensureIds(items) {
    if (!Array.isArray(items)) return [];
    let maxId = this._idCounter;
    items.forEach(item => {
      const parsed = this._parseId(item && item.id);
      if (parsed > maxId) maxId = parsed;
    });
    this._idCounter = maxId;

    items.forEach(item => {
      if (!item.id) item.id = this._nextId();
    });
    return items;
  }

  _nextId() {
    this._idCounter += 1;
    return `b${this._idCounter}`;
  }

  _parseId(id) {
    if (!id) return 0;
    const match = String(id).match(/(\d+)/);
    return match ? Number(match[1]) : 0;
  }

  _delay(value) {
    return new Promise(resolve => setTimeout(() => resolve(value), this.delay));
  }

  _clone(value) {
    if (value === undefined) return value;
    return JSON.parse(JSON.stringify(value));
  }

  _load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (err) {
      console.error('Failed to load books from storage', err);
      return null;
    }
  }

  _save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (err) {
      console.error('Failed to save books to storage', err);
    }
  }
}
