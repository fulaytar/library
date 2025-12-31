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
    /*     console.log(this.books, 'this.books');
    console.log(this.allBooks, 'this.allBooks');
    console.log(this.filteredBooks, 'this.filteredBooks'); */
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
    this.books.push(book);
  }
  deleteBook(index) {
    this.books.splice(index, 1);
  }
  getBooks() {
    return this.books;
  }
  editBook(index, newBook) {
    this.books[index] = newBook;
  }
  detailsBook(index) {
    return this.books[index].details;
  }
}
