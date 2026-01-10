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

    if (this.cancelText) {
      const btnCancel = document.createElement('button');
      btnCancel.type = 'button';
      btnCancel.className = 'btn btn-secondary';
      btnCancel.dataset.bsDismiss = 'modal';
      btnCancel.textContent = this.cancelText;
      footer.appendChild(btnCancel);
    }

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

    // Always clean up modal DOM and Bootstrap instance when it becomes hidden
    modal.addEventListener('hidden.bs.modal', () => {
      try {
        const inst = bootstrap.Modal.getInstance(modal);
        if (inst) inst.dispose();
      } catch (e) {
        // ignore
      }
      if (modal.parentNode) modal.parentNode.removeChild(modal);
    });

    return modal;
  }

  open() {
    // ensure modal is focusable and not inert when opened
    if (
      this.modalElement.hasAttribute &&
      this.modalElement.hasAttribute('inert')
    ) {
      this.modalElement.removeAttribute('inert');
    }

    this.bsModal = new bootstrap.Modal(this.modalElement);
    this.bsModal.show();

    const btnConfirm = this.modalElement.querySelector('.btn-primary');
    if (btnConfirm) btnConfirm.focus();
  }

  close() {
    // Prevent descendants keeping focus when modal is hidden
    try {
      if (this.modalElement && this.modalElement.setAttribute)
        this.modalElement.setAttribute('inert', '');
      if (
        document.activeElement &&
        this.modalElement &&
        this.modalElement.contains(document.activeElement)
      ) {
        document.activeElement.blur();
      }
    } catch (e) {
      // ignore
    }

    // Hide modal via Bootstrap. The hidden handler attached in createModal
    // will dispose the Bootstrap instance and remove the element from DOM.
    if (this.bsModal) {
      this.bsModal.hide();
    } else if (this.modalElement) {
      // If there's no bootstrap instance (e.g., dismissed via data-bs-dismiss),
      // clean up immediately as a fallback.
      try {
        const inst = bootstrap.Modal.getInstance(this.modalElement);
        if (inst) inst.dispose();
      } catch (e) {}
      if (this.modalElement.parentNode)
        this.modalElement.parentNode.removeChild(this.modalElement);
      this.modalElement = null;
      this.bsModal = null;
    }
  }
}
