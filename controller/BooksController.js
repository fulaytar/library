import books from '../books.js';

export class BooksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init();
  }

  init() {
    this.model.addAllBooks(books);
    this.view.render(this.model.getBooks());
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
