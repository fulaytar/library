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

  setAllBooks(allBooks) {
    this.allBooks = allBooks || [];
    this.filteredBooks = this.allBooks;
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
      const matchesText = !text || book.title.toLowerCase().includes(text);

      if (!matchesText) return false;

      // author filter
      if (
        author &&
        (!book.details ||
          !book.details.author ||
          !book.details.author.toLowerCase().includes(author.toLowerCase()))
      )
        return false;

      // genre filter
      if (
        genre &&
        (!book.details || !book.details.genre || book.details.genre !== genre)
      )
        return false;

      // year range filter
      if (yearFrom && Number(book.year) < Number(yearFrom)) return false;
      if (yearTo && Number(book.year) > Number(yearTo)) return false;

      return true;
    });
  }

  addBook(book) {
    if (!book) return;

    const { title, year, details } = book;
    const { author, genre, pages } = details;

    // Перевіряємо, що обов'язкові поля заповнені
    if (!title || !year || !author || !genre || !pages) {
      alert('Some required fields are missing. Book was not added.');
      return;
    }
    this.allBooks.push(book);
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
    this.books[index] = newBook;
    if (this.allBooks[globalIndex]) this.allBooks[globalIndex] = newBook;
    if (this.filteredBooks[globalIndex])
      this.filteredBooks[globalIndex] = newBook;
  }

  detailsBook(index) {
    return this.books[index] && this.books[index].details;
  }

  getGenres() {
    const set = new Set();
    this.allBooks.forEach(b => {
      if (b.details && b.details.genre) set.add(b.details.genre);
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
        escape(b.details && b.details.author),
        escape(b.year),
        escape(b.details && b.details.genre),
        escape(b.details && b.details.pages),
      ];
      rows.push(r.join(','));
    });

    return {
      data: rows.join('\n'),
      fileName: `books_export_${checkNameExport}.csv`,
      mimeType: 'text/csv;charset=utf-8;',
    };
  }
}
/* Робота з даними  */
