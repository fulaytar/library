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
      // mark inert (prevents focus) if browser supports it
      if (this.modalElement) {
        if (this.modalElement.setAttribute)
          this.modalElement.setAttribute('inert', '');
      }
      // blur any focused element inside modal
      if (
        document.activeElement &&
        this.modalElement &&
        this.modalElement.contains(document.activeElement)
      ) {
        document.activeElement.blur();
      }
    } catch (e) {
      // ignore errors
      console.warn('Could not set inert/blur during modal close', e);
    }

    // Wait for Bootstrap to finish hiding, then remove element
    const onHidden = () => {
      if (this.modalElement && this.modalElement.remove)
        this.modalElement.remove();
      this.modalElement = null;
      this.bsModal = null;
      this.modalElement &&
        this.modalElement.removeEventListener &&
        this.modalElement.removeEventListener('hidden.bs.modal', onHidden);
    };

    if (this.modalElement) {
      this.modalElement.addEventListener('hidden.bs.modal', onHidden, {
        once: true,
      });
    }

    if (this.bsModal) this.bsModal.hide();
  }
}
