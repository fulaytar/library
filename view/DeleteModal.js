import { Modal } from './Modal.js';

export class DeleteModal extends Modal {
  constructor(book, onConfirm) {
    console.log(book);
    const body = `
      <p>Are you sure you want to delete the book <strong>${book.title}</strong> by ${book.details.author}?</p>
    `;

    super({
      title: 'Delete Book',
      body,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: () => {
        if (onConfirm) onConfirm();
      },
    });
  }
}
