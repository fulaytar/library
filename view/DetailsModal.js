import { Modal } from './Modal.js';

export class DetailsModal extends Modal {
  constructor(book) {
    const historyHtml =
      (book.history || [])
        .slice()
        .reverse()
        .map(h => {
          const changes = h.changes
            .map(
              c =>
                `<div><strong>${c.field}:</strong> "${c.from}" → "${c.to}"</div>`
            )
            .join('');
          const date = new Date(h.ts).toLocaleString();
          return `<div class="mb-2"><div class="text-muted small">${date} — ${h.editor}</div>${changes}</div>`;
        })
        .join('') || '<div class="text-muted">No changes recorded</div>';

    const author = (book.details && book.details.author) || book.author || '-';
    const genre = (book.details && book.details.genre) || book.genre || '-';
    const pages = (book.details && book.details.pages) || book.pages || '-';
    const year = book.year || '-';

    const body = `
      <p><strong>Author:</strong> ${author}</p>
      <p><strong>Year:</strong> ${year}</p>
      <p><strong>Genre:</strong> ${genre}</p>
      <p><strong>Pages:</strong> ${pages}</p>
      <hr>
      <h6>Change history</h6>
      <div id="book-history">${historyHtml}</div>
    `;
    super({
      title: `Detail book: ${book.title}`,
      body,
      confirmText: 'Close',
      cancelText: '',
    });
  }
}
