export class Modal {
  constructor({
    title = '',
    body = '',
    confirmText = 'OK',
    onConfirm = null,
    cancelText = 'Відміна',
  }) {
    this.title = title;
    this.body = body;
    this.confirmText = confirmText;
    this.cancelText = cancelText;
    this.onConfirm = onConfirm;

    this.modalElement = this.createModal();
  }

  createModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.tabIndex = -1;

    // Вставляємо структуру
    modal.innerHTML = `
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${this.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">${this.body}</div>
          <div class="modal-footer"></div>
        </div>
      </div>
    `;

    const footer = modal.querySelector('.modal-footer');

    // Кнопка Cancel
    if (this.cancelText) {
      const btnCancel = document.createElement('button');
      btnCancel.type = 'button';
      btnCancel.className = 'btn btn-secondary';
      btnCancel.dataset.bsDismiss = 'modal';
      btnCancel.textContent = this.cancelText;
      footer.appendChild(btnCancel);
    }

    // Кнопка Confirm
    const btnConfirm = document.createElement('button');
    btnConfirm.type = 'button';
    btnConfirm.className = 'btn btn-primary';
    btnConfirm.textContent = this.confirmText;
    btnConfirm.addEventListener('click', () => {
      if (this.onConfirm) this.onConfirm();
      this.close();
    });
    footer.appendChild(btnConfirm);

    document.body.appendChild(modal);
    return modal;
  }

  open() {
    // Створюємо Bootstrap модалку
    this.bsModal = new bootstrap.Modal(this.modalElement);
    this.bsModal.show();

    // Ставимо фокус на Confirm кнопку після відкриття
    const btnConfirm = this.modalElement.querySelector('.btn-primary');
    if (btnConfirm) btnConfirm.focus();
  }

  close() {
    if (this.bsModal) this.bsModal.hide();
  }
}
