export class BooksModel {
  constructor() {
    this.books = [];
    this.currentPage = 1;
    this.perPage = 10;
    this.allBooks = [];
    this.filteredBooks = [];
  }

  setAllBooks(allBooks) {
    this.allBooks = allBooks;
    this.filteredBooks = allBooks;
    this.setPage(1);
  }

  setPage(page) {
    const totalPages = Math.ceil(this.filteredBooks.length / this.perPage);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    this.currentPage = page;

    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    this.books = this.filteredBooks.slice(start, end);
  }
  searchBooks(query) {
    const text = query.toLowerCase().trim();

    if (!text) {
      this.filteredBooks = this.allBooks;
    } else {
      this.filteredBooks = this.allBooks.filter(
        book =>
          book.title.toLowerCase().includes(text) ||
          book.details.author.toLowerCase().includes(text) ||
          book.year.toString().includes(text)
      );
    }

    this.setPage(1);
  }

  addBook(book) {
    if (!book) return;

    const { title, year, details } = book;
    const { author, genre, pages } = details;

    // Перевіряємо, що обов'язкові поля заповнені
    if (!title || !year || !author || !genre || !pages) {
      console.alert('Some required fields are missing. Book was not added.');
      return;
    }
    this.allBooks.push(book);
  }
  deleteBook(index) {
    const globalIndex = (this.currentPage - 1) * this.perPage + index;
    this.filteredBooks.splice(globalIndex, 1);
    this.allBooks.slice(globalIndex, 1);
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
    this.allBooks[globalIndex] = newBook;
    this.filteredBooks[globalIndex] = newBook;
  }
  detailsBook(index) {
    return this.books[index].details;
  }
  exportBook(index) {
    const book = this.model.getBooks()[index];
    const json = JSON.stringify(book, null, 2);

    navigator.clipboard
      .writeText(json)
      .then(() => {
        alert(`Book "${book.title}" copied to clipboard!`);
      })
      .catch(err => {
        console.error('Failed to copy book: ', err);
        alert('Failed to copy book!');
      });
  }
}
/* Робота з даними  */
