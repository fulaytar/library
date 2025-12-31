import books from '../books.js';
import { DetailsModal } from '../view/DetailsModal.js';
import { FormModal } from '../view/FormModal.js';
import { DeleteModal } from '../view/DeleteModal.js';

export class BooksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.setAllBooks(books);
    this.view.onSearch = query => {
      this.model.searchBooks(query);
      this.updateView();
    };
    this.view.onDetails = index => {
      const book = this.model.getBooks()[index];
      new DetailsModal(book).open();
    };

    this.view.onEdit = index => {
      const book = this.model.getBooks()[index];
      new FormModal({
        book,
        onConfirm: updatedBook => {
          this.model.editBook(index, updatedBook);
          this.updateView();
        },
      }).open();
    };

    this.view.onDelete = index => {
      const book = this.model.getBooks()[index];
      console.log(book);
      new DeleteModal(book, () => {
        this.model.deleteBook(index);
        this.updateView();
      }).open();
    };
    this.updateView();
  }

  changePage(page) {
    this.model.setPage(page);
    this.updateView();
  }

  updateView() {
    const totalPages = Math.ceil(
      this.model.filteredBooks.length / this.model.perPage
    );
    this.view.render(
      this.model.getBooks(),
      this.model.currentPage,
      this.model.perPage
    );

    this.view.renderPagination(
      totalPages,
      this.model.currentPage,
      (this.view.onPageChange = page => this.changePage(page))
    );
  }
  actionsBtn(index, newBook) {
    this.onDetails = this.model.detailsBook(index);
    this.onEdit = this.model.editBook(index, newBook);
    this.onDelete = this.model.deleteBook(index);
    this.onExport = null;
  }
}

//слухає події, керує view and model
