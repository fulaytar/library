import { Modal } from './Modal.js';

export class AddModal extends Modal {
  constructor({ onConfirm }) {
    const body = `
      <form id="book-form">
        <div class="mb-3">
          <label for="book-title" class="form-label">Title</label>
          <input type="text" class="form-control" name="title" id="book-title" value="" required>
        </div>
        <div class="mb-3">
          <label for="book-author" class="form-label">Author</label>
          <input type="text" class="form-control"  name="author" id="book-author" value="" required>
        </div>
        <div class="mb-3">
          <label for="book-year" class="form-label">Year</label>
          <input type="number" class="form-control"  name="year" id="book-year" value="" required>
        </div>
        <div class="mb-3">
          <label for="book-genre" class="form-label">Genre</label>
          <input type="text" class="form-control" name="genre" id="book-genre" value="" required>
        </div>
        <div class="mb-3">
          <label for="book-pages" class="form-label">Pages</label>
          <input type="number" class="form-control" name="pages" id="book-pages" value=""required>
        </div>
      </form>
    `;

    super({
      title: `Add a book here`,
      body,
      confirmText: 'Save',
      cancelText: 'Cancel',
      onConfirm: () => {
        const form = document.querySelector('#book-form');
        const data = new FormData(form);

        const newBook = {
          title: data.get('title'),
          year: Number(data.get('year')),
          details: {
            author: data.get('author'),
            genre: data.get('genre'),
            pages: Number(data.get('pages')),
          },
        };
        onConfirm(newBook);
      },
    });
  }
}
