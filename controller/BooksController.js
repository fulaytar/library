import books from '../books.js';

export class BooksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.setAllBooks(books);

    this.updateView();
  }

  changePage(page) {
    this.model.setPage(page);
    this.updateView();
  }

  updateView() {
    this.view.render(this.model.getBooks());

    const totalPages = Math.ceil(
      this.model.allBooks.length / this.model.perPage
    );
    this.view.renderPagination(
      totalPages,
      this.model.currentPage,
      this.changePage.bind(this)
    );
  }
}

/* export class TaskController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    document.getElementById('addTaskButton').addEventListener('click', () => {
      const input = document.getElementById('taskInput');
      const value = input.value.trim();

      if (!value) return;

      this.model.addTask(value);
      this.view.render(this.model.getTasks());
      input.value = '';
    });
    // передаємо функції у вид
    this.view.onDelete = index => {
      this.model.deleteTask(index);
      this.view.render(this.model.getTasks());
    };
  }
} */
//слухає події, керує view and model
