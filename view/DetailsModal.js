import { Modal } from './Modal.js';

export class DetailsModal extends Modal {
  constructor(book = null) {
    const hasBook = Boolean(book);
    const title = hasBook ? `Detail book: ${book.title}` : 'Book details';
    const body = hasBook
      ? DetailsModal.buildBody(book)
      : DetailsModal.loadingBody();

    super({
      title,
      body,
      confirmText: 'Close',
      cancelText: '',
    });

    this.bodyEl = this.modalElement.querySelector('.modal-body');
    this.titleEl = this.modalElement.querySelector('.modal-title');
  }

  setBook(book) {
    if (!book) return;
    if (this.titleEl) this.titleEl.textContent = `Detail book: ${book.title}`;
    if (this.bodyEl) this.bodyEl.innerHTML = DetailsModal.buildBody(book);
  }

  setError(message) {
    if (this.bodyEl) {
      this.bodyEl.innerHTML = `<div class="text-danger">${message}</div>`;
    }
  }

  static loadingBody() {
    return `
      <div class="text-center align-middle py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  static buildBody(book) {
    const historyHtml =
      (book.history || [])
        .slice()
        .reverse()
        .map(h => {
          const changes = h.changes
            .map(
              c =>
                `<div><strong>${c.field}:</strong> "${c.from}" -> "${c.to}"</div>`
            )
            .join('');
          const date = new Date(h.ts).toLocaleString();
          return `<div class="mb-2"><div class="text-muted small">${date} - ${h.editor}</div>${changes}</div>`;
        })
        .join('') || '<div class="text-muted">No changes recorded</div>';

    const author = (book.details && book.details.author) || book.author || '-';
    const genre = (book.details && book.details.genre) || book.genre || '-';
    const pages = (book.details && book.details.pages) || book.pages || '-';
    const year = book.year || '-';

    return `
      <p><strong>Author:</strong> ${author}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Genre:</strong> ${genre}</p>
      <p><strong>Pages:</strong> ${pages}</p>
      <hr>
      <h6>Change history</h6>
      <div id="book-history">${historyHtml}</div>
    `;
  }
}
