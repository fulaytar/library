import books from '../books.js';
import { DetailsModal } from '../view/DetailsModal.js';
import { FormModal } from '../view/FormModal.js';
import { DeleteModal } from '../view/DeleteModal.js';
import { AddModal } from '../view/AddModal.js';

export class BooksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.storageKey = 'library_books';

    const storedBooks = this.loadStoredBooks();
    this.model.setAllBooks(storedBooks || books);

    this.view.renderFilters(
      this.model.getGenres(),
      this.model.currentFilters.genre || ''
    );

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
        genres: this.model.getGenres(),
        onConfirm: updatedBook => {
          const editor = this.view.getUserName
            ? this.view.getUserName()
            : 'unknown';
          this.model.editBook(index, updatedBook, editor);
          this.saveBooks();
          this.updateView();
        },
      }).open();
    };

    this.view.onAdd = () => {
      new AddModal({
        genres: this.model.getGenres(),
        onConfirm: newBook => {
          const creator = this.view.getUserName
            ? this.view.getUserName()
            : 'unknown';
          this.model.addBook(newBook, creator);
          this.saveBooks();
          this.updateView();
        },
      }).open();
    };

    this.view.onDelete = index => {
      const book = this.model.getBooks()[index];
      new DeleteModal(book, () => {
        this.model.deleteBook(index);
        this.saveBooks();
        this.updateView();
      }).open();
    };

    this.updateView();
  }

  loadStoredBooks() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (err) {
      console.error('Failed to load stored books', err);
      return null;
    }
  }

  saveBooks() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify(this.model.allBooks)
      );
    } catch (err) {
      console.error('Failed to save books', err);
    }
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

    // header + analytics
    if (this.view.renderHeader) this.view.renderHeader({ userName: 'Guest' });
    if (this.view.renderAnalytics)
      this.view.renderAnalytics(this.model.getAnalytics());

    this.view.renderPagination(
      totalPages,
      this.model.currentPage,
      (this.view.onPageChange = page => this.changePage(page))
    );

    this.view.renderFilters(
      this.model.getGenres(),
      this.model.currentFilters.genre || ''
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
