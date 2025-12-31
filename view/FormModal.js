import { Modal } from './Modal.js';

export class FormModal extends Modal {
  constructor(book) {
    const body = `
      <form id="book-form">
        <div class="mb-3">
          <label for="book-title" class="form-label">Title</label>
          <input type="text" class="form-control" id="book-title" value="${
            book.book.title
          }" required>
        </div>
        <div class="mb-3">
          <label for="book-author" class="form-label">Author</label>
          <input type="text" class="form-control" id="book-author" value="${
            book.book.details.author
          }" required>
        </div>
        <div class="mb-3">
          <label for="book-year" class="form-label">Year</label>
          <input type="number" class="form-control" id="book-year" value="${
            book.book.year
          }" required>
        </div>
        <div class="mb-3">
          <label for="book-genre" class="form-label">Genre</label>
          <input type="text" class="form-control" id="book-genre" value="${
            book.book.details.genre || ''
          }">
        </div>
        <div class="mb-3">
          <label for="book-pages" class="form-label">Pages</label>
          <input type="number" class="form-control" id="book-pages" value="${
            book.book.details.pages || ''
          }">
        </div>
      </form>
    `;
    super({
      title: `Detail book: ${book.title}`,
      body,
      confirmText: 'Save',
      cancelText: 'Cancel',
      onConfirm: () => {
        console.log('complete');
      },
    });
  }
}
