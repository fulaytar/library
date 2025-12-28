export class BooksModel {
  constructor() {
    this.books = [];
    this.currentPage = 1;
    this.perPage = 10;
    this.allBooks = [];
  }

  setAllBooks(allBooks) {
    this.allBooks = allBooks;
    this.setPage(1);
  }

  setPage(page) {
    const totalPages = Math.ceil(this.allBooks.length / this.perPage);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    this.currentPage = page;

    const start = (this.currentPage - 1) * this.perPage;
    const end = start + this.perPage;
    this.books = this.allBooks.slice(start, end);
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

/* export class TaskModel {
  constructor() {
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
  }

  getTasks() {
    return this.tasks;
  }
  deleteTask(index) {
    this.tasks = this.tasks.filter(element => element !== this.tasks[index]);
  }
} */
//модель працює тільки з даними
