import { Modal } from './Modal.js';

export class DetailsModal extends Modal {
  constructor(book) {
    const body = `
      <p><strong>Author:</strong> ${book.details.author}</p>
      <p><strong>Year:</strong> ${book.year}</p>
      <p><strong>Genre:</strong> ${book.details.genre || '-'}</p>
      <p><strong>Pages:</strong> ${book.details.pages || '-'}</p>
    `;
    super({
      title: `Detail book: ${book.title}`,
      body,
      confirmText: 'Close',
      cancelText: '',
    });
  }
}
