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
    const totalPages = Math.ceil(
      this.model.allBooks.length / this.model.perPage
    );
    this.view.render(
      this.model.getBooks(),
      this.model.currentPage,
      this.model.perPage
    );

    this.view.renderPagination(
      totalPages,
      this.model.currentPage,
      this.changePage.bind(this)
    );
  }
}

//слухає події, керує view and model
