import books from '../books.js';
import { DetailsModal } from '../view/DetailsModal.js';
import { FormModal } from '../view/FormModal.js';
import { DeleteModal } from '../view/DeleteModal.js';
import { AddModal } from '../view/AddModal.js';

export class BooksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.model.setAllBooks(books);

    this.view.renderFilters(this.model.getGenres());

    this.view.onSearch = query => {
      this.model.searchBooks(query);
      this.updateView();
    };

    this.view.onFilter = filters => {
      this.model.filterBooks(filters);
      this.updateView();
    };

    this.view.onExport = options => {
      try {
        const { data, fileName, mimeType } = this.model.exportData(
          options.format,
          options.scope
        );
        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Export failed', err);
        alert('Failed to export data');
      }
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

    this.view.onAdd = () => {
      new AddModal({
        onConfirm: newBook => {
          this.model.addBook(newBook);
          this.updateView();
        },
      }).open();
    };

    this.view.onDelete = index => {
      const book = this.model.getBooks()[index];
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

    this.view.renderFilters(this.model.getGenres());
  }
  actionsBtn(index, newBook) {
    this.onDetails = this.model.detailsBook(index);
    this.onEdit = this.model.editBook(index, newBook);
    this.onDelete = this.model.deleteBook(index);
    this.onExport = null;
  }
}
//слухає події, керує view and model
