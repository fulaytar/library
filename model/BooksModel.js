export class BooksModel {
  constructor() {
    this.books = [];
    this.currentPage = 1;
    this.perPage = 10;
  }

  addAllBooks(allBooks) {
    const start = (this.currentPage - 1) * this.perPage; // перший елемент сторінки
    const end = start + this.perPage; // після останнього елемента
    const sortedPage = allBooks.slice(start, end); // беремо тільки поточну сторінку

    this.books = [...sortedPage];
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
