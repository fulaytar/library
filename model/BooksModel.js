export class BooksModel {
  constructor() {
    this.books = [];
    this.currentPage = 1;
    this.perPage = 10;

    this.allBooks = [];
    this.filteredBooks = [];

    this.searchQuery = '';
    this.currentFilters = {}; // { author, genre, yearFrom, yearTo }
  }

  _normalizeBook(book) {
    if (!book) return book;
    const normalized = Object.assign({}, book);
    if (book.details) {
      const { author, genre, pages } = book.details;
      if (author) normalized.author = author;
      if (genre) normalized.genre = genre;
      if (pages !== undefined) normalized.pages = pages;
    }
    return normalized;
  }

  setAllBooks(allBooks) {
    this.allBooks = (allBooks || []).map(b => this._normalizeBook(b));
    this.filteredBooks = this.allBooks.slice();
    this.setPage(1);
  }

  setPage(page) {
    const totalPages = Math.max(
      1,
      Math.ceil(this.filteredBooks.length / this.perPage)
    );
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    this.currentPage = page;

    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    this.books = this.filteredBooks.slice(start, end);
  }

  searchBooks(query) {
    this.searchQuery = (query || '').toString().toLowerCase().trim();
    this.applyFiltersAndSearch();
    this.setPage(1);
  }

  filterBooks(filters) {
    this.currentFilters = filters || {};
    this.applyFiltersAndSearch();
    this.setPage(1);
  }

  applyFiltersAndSearch() {
    const text = this.searchQuery;
    const {
      author = '',
      genre = '',
      yearFrom = '',
      yearTo = '',
    } = this.currentFilters;

    this.filteredBooks = this.allBooks.filter(book => {
      // search text matching
      const matchesText =
        !text || (book.title || '').toString().toLowerCase().includes(text);

      if (!matchesText) return false;

      // author filter (use top-level `author` if present)
      if (author) {
        const a = book.author || (book.details && book.details.author) || '';
        if (!a.toLowerCase().includes(author.toLowerCase())) return false;
      }

      // genre filter
      if (genre) {
        const g = book.genre || (book.details && book.details.genre) || '';
        if (g !== genre) return false;
      }

      // year range filter
      if (yearFrom && Number(book.year) < Number(yearFrom)) return false;
      if (yearTo && Number(book.year) > Number(yearTo)) return false;

      return true;
    });
  }

  addBook(book) {
    if (!book) return;

    const nb = this._normalizeBook(book);
    const { title, year, author, genre, pages } = nb;

    // Перевіряємо, що обов'язкові поля заповнені
    if (!title || !year || !author || !genre || !pages) {
      alert('Some required fields are missing. Book was not added.');
      return;
    }
    this.allBooks.push(nb);
    this.applyFiltersAndSearch();
  }

  deleteBook(index) {
    const globalIndex = (this.currentPage - 1) * this.perPage + index;
    if (globalIndex >= 0 && globalIndex < this.filteredBooks.length) {
      // remove from filtered and allBooks
      const removed = this.filteredBooks.splice(globalIndex, 1);
      const removedBook = removed[0];
      // find and remove one occurrence in allBooks (by reference or matching title)
      const ai = this.allBooks.findIndex(
        b =>
          b === removedBook ||
          (b.title === removedBook.title && b.year === removedBook.year)
      );
      if (ai !== -1) this.allBooks.splice(ai, 1);
      if (this.filteredBooks.length === 0) {
        this.searchQuery = '';
        this.currentFilters = {};
        this.applyFiltersAndSearch();
        this.setPage(1);
      }
    }

    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    this.books = this.filteredBooks.slice(start, end);
  }

  getBooks() {
    return this.books;
  }

  editBook(index, newBook) {
    const globalIndex = (this.currentPage - 1) * this.perPage + index;
    const nb = this._normalizeBook(newBook);
    this.books[index] = nb;
    if (this.allBooks[globalIndex]) this.allBooks[globalIndex] = nb;
    if (this.filteredBooks[globalIndex]) this.filteredBooks[globalIndex] = nb;
  }

  detailsBook(index) {
    const book = this.books[index];
    if (!book) return undefined;
    if (book.details) return book.details;
    return {
      author: book.author || '',
      genre: book.genre || '',
      pages: book.pages || '',
    };
  }

  getGenres() {
    const set = new Set();
    this.allBooks.forEach(b => {
      if (b.genre) set.add(b.genre);
      else if (b.details && b.details.genre) set.add(b.details.genre);
    });
    return Array.from(set).sort();
  }

  exportData(format = 'csv', scope = 'all') {
    const checkNameExport =
      scope === 'all' ? 'all' : `_page-${this.currentPage}`;
    const arr =
      scope === 'page' ? this.books.slice() : this.filteredBooks.slice();

    if (format === 'json') {
      return {
        data: JSON.stringify(arr, null, 2),
        fileName: `books_export_${checkNameExport}.json`,
        mimeType: 'application/json',
      };
    }

    // CSV
    const rows = [];
    const header = ['Title', 'Author', 'Year', 'Genre', 'Pages'];
    rows.push(header.join(','));

    const escape = v => {
      if (v === undefined || v === null) return '';
      const s = String(v);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };

    arr.forEach(b => {
      const r = [
        escape(b.title),
        escape(b.author || (b.details && b.details.author)),
        escape(b.year),
        escape(b.genre || (b.details && b.details.genre)),
        escape(b.pages || (b.details && b.details.pages)),
      ];
      rows.push(r.join(','));
    });

    return {
      data: rows.join('\n'),
      fileName: `books_export_${checkNameExport}.csv`,
      mimeType: 'text/csv;charset=utf-8;',
    };
  }

  getAnalytics() {
    const totalBooks = this.allBooks.length;
    const genres = {};
    this.allBooks.forEach(b => {
      const g = b.genre || (b.details && b.details.genre) || 'Unknown';
      genres[g] = (genres[g] || 0) + 1;
    });
    return { totalBooks, genres };
  }
}
/* Робота з даними  */
