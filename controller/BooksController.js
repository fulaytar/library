import books from '../books.js';
import { FakeBooksApi } from '../fakeApi.js';
import { DetailsModal } from '../view/DetailsModal.js';
import { FormModal } from '../view/FormModal.js';
import { DeleteModal } from '../view/DeleteModal.js';
import { AddModal } from '../view/AddModal.js';

export class BooksController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.storageKey = 'library_books';
    this.api = new FakeBooksApi({
      seedBooks: books,
      storageKey: this.storageKey,
      delay: 300,
    });

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

    this.view.onDetails = async index => {
      const book = this.model.getBooks()[index];
      if (!book) return;
      const modal = new DetailsModal();
      modal.open();
      try {
        const fullBook = await this.api.details(book);
        modal.setBook(fullBook || book);
      } catch (err) {
        console.error('Failed to load details', err);
        modal.setError('Failed to load details');
      }
    };

    this.view.onEdit = index => {
      const book = this.model.getBooks()[index];
      if (!book) return;
      new FormModal({
        book,
        genres: this.model.getGenres(),
        onConfirm: async updatedBook => {
          const editor = this.view.getUserName
            ? this.view.getUserName()
            : 'unknown';
          try {
            if (this.view.showLoading) this.view.showLoading();
            this.model.editBook(index, updatedBook, editor);
            const updatedWithHistory = this.model.getBooks()[index];
            await this.api.update(book, updatedWithHistory);
            this.updateView();
          } catch (err) {
            console.error('Failed to update book', err);
            alert('Failed to update book');
          } finally {
            if (this.view.hideLoading) this.view.hideLoading();
          }
        },
      }).open();
    };

    this.view.onAdd = () => {
      new AddModal({
        genres: this.model.getGenres(),
        onConfirm: async newBook => {
          const creator = this.view.getUserName
            ? this.view.getUserName()
            : 'unknown';
          try {
            if (this.view.showLoading) this.view.showLoading();
            const created = await this.api.create(newBook);
            const createdWithHistory = this.model.addBook(
              created || newBook,
              creator
            );
            if (createdWithHistory) {
              await this.api.update(created || newBook, createdWithHistory);
            }
            this.updateView();
          } catch (err) {
            console.error('Failed to create book', err);
            alert('Failed to create book');
          } finally {
            if (this.view.hideLoading) this.view.hideLoading();
          }
        },
      }).open();
    };

    this.view.onDelete = index => {
      const book = this.model.getBooks()[index];
      if (!book) return;
      new DeleteModal(book, async () => {
        try {
          if (this.view.showLoading) this.view.showLoading();
          await this.api.remove(book);
          this.model.deleteBook(index);
          this.updateView();
        } catch (err) {
          console.error('Failed to delete book', err);
          alert('Failed to delete book');
        } finally {
          if (this.view.hideLoading) this.view.hideLoading();
        }
      }).open();
    };

    this.init();
  }

  async init() {
    try {
      if (this.view.showLoading) this.view.showLoading();
      const storedBooks = await this.api.list();
      this.model.setAllBooks(storedBooks || []);

      this.view.renderFilters(
        this.model.getGenres(),
        this.model.currentFilters.genre || ''
      );

      this.updateView();
    } catch (err) {
      console.error('Failed to load books', err);
      alert('Failed to load books');
    } finally {
      if (this.view.hideLoading) this.view.hideLoading();
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
