export class BooksView {
  constructor(container) {
    this.container = container;
    this.renderSearch();

    this.onPageChange = null;
    this.onSearch = null;
    //Modalka
    this.onDetails = null;
    this.onEdit = null;
    this.onDelete = null;
    this.onExport = null;
  }
  render(books, currentPage, perPage) {
    this.container.innerHTML = `<td colspan="3" style="height:100px; vertical-align:middle;" class="text-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</td>`;
    setTimeout(() => {
      this.container.innerHTML = '';

      books.forEach((book, index) => {
        // створюємо рядок таблиці
        const tr = document.createElement('tr');

        // номер
        const th = document.createElement('th');
        th.scope = 'row';
        th.textContent = index + 1 + (currentPage - 1) * perPage;

        // назва книги
        const tdTitle = document.createElement('td');
        tdTitle.textContent = book.title;
        tdTitle.style.cursor = 'pointer';
        tdTitle.style.maxWidth = '500px';
        tdTitle.style.whiteSpace = 'nowrap';
        tdTitle.style.overflow = 'hidden';
        tdTitle.style.textOverflow = 'ellipsis';

        const tdAButtons = document.createElement('td');

        const btnDetails = document.createElement('button');
        btnDetails.textContent = 'Details';
        btnDetails.className = 'btn btn-sm btn-info me-1';
        btnDetails.addEventListener('click', () => {
          if (this.onDetails) this.onDetails(index);
        });

        const btnEdit = document.createElement('button');
        btnEdit.textContent = 'Edit';
        btnEdit.className = 'btn btn-sm btn-warning me-1';
        btnEdit.addEventListener('click', () => {
          if (this.onEdit) this.onEdit(index);
        });

        const btnDelete = document.createElement('button');
        btnDelete.textContent = 'Delete';
        btnDelete.className = 'btn btn-sm btn-danger me-1';
        btnDelete.addEventListener('click', () => {
          if (this.onDelete) this.onDelete(index);
        });

        const btnExport = document.createElement('button');
        btnExport.textContent = 'Export';
        btnExport.className = 'btn btn-sm  btn-outline-success me-1 ';
        btnExport.addEventListener('click', () => {
          this.onExport?.();
        });

        const btnAddBook = document.createElement('button');
        btnAddBook.textContent = 'Add book?';
        btnAddBook.style.position = 'fixed';
        btnAddBook.style.bottom = '30px';
        btnAddBook.style.right = '30px';
        btnAddBook.style.padding = '10px 20px';
        btnAddBook.style.backgroundColor = '#6f42c1';
        btnAddBook.style.color = 'white';
        btnAddBook.style.border = 'none';
        btnAddBook.style.borderRadius = '5px';
        btnAddBook.style.cursor = 'pointer';
        btnAddBook.style.boxShadow = '0 4px 4px rgba(0,0,0,0.2)';
        btnAddBook.style.zIndex = '1000';
        btnAddBook.style.fontSize = '16px';

        // Додаємо кнопку на сторінку
        document.body.appendChild(btnAddBook);

        tdAButtons.append(btnDetails, btnEdit, btnDelete, btnExport);

        tr.appendChild(th);
        tr.appendChild(tdTitle);
        tr.appendChild(tdAButtons);

        // додаємо рядок у таблицю
        this.container.appendChild(tr);
      });
    }, 500);
  }
  renderPagination(totalPages, currentPage, onPageChange) {
    let paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
      paginationContainer = document.createElement('ul');
      paginationContainer.id = 'pagination';
      paginationContainer.className = 'pagination justify-content-center';
      this.container.parentNode.appendChild(paginationContainer);
    }
    paginationContainer.innerHTML = '';

    //button firt pages ⬅
    if (totalPages !== 0) {
      const firstPage = document.createElement('li');
      firstPage.classList.add('page-item');
      if (currentPage === 1) firstPage.classList.add('disabled');
      const btnFirstPage = document.createElement('button');
      btnFirstPage.className = 'page-link';
      btnFirstPage.textContent = '<';
      btnFirstPage.addEventListener('click', () => {
        onPageChange(currentPage - 1);
      });
      firstPage.appendChild(btnFirstPage);
      paginationContainer.appendChild(firstPage);
    }

    // end button back ⬅

    /* ========= Setting pages ========= */
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // first page
      pages.push(1);

      // left ellipsis
      if (currentPage >= 4) {
        pages.push('...');
      }

      // middle pages (current -1, current, current +1)
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // right ellipsis
      if (currentPage <= totalPages - 3) {
        pages.push('...');
      }

      // last page
      pages.push(totalPages);
    }

    pages.forEach(page => {
      if (page === '...') {
        const ellipsis = document.createElement('li');
        ellipsis.classList.add('page-item', 'disabled');

        const ellipsisSpan = document.createElement('span');
        ellipsisSpan.classList.add('page-link');
        ellipsisSpan.textContent = '...';

        ellipsis.appendChild(ellipsisSpan);
        paginationContainer.appendChild(ellipsis);
        return;
      }

      const li = document.createElement('li');
      li.classList.add('page-item');
      if (page === currentPage) li.classList.add('active');

      const btn = document.createElement('button');
      btn.className = 'page-link';
      btn.textContent = page;
      btn.addEventListener('click', () => onPageChange(page));

      li.appendChild(btn);
      paginationContainer.appendChild(li);
    });
    /* ========= Setting pages ========= */

    //button next ⭢
    if (totalPages !== 0) {
      const nextElement = document.createElement('li');
      nextElement.classList.add('page-item');
      if (currentPage === totalPages) nextElement.classList.add('disabled');

      const btnNextElement = document.createElement('button');
      btnNextElement.className = 'page-link';
      btnNextElement.textContent = '>';
      btnNextElement.addEventListener('click', () => {
        onPageChange(currentPage + 1);
      });
      nextElement.appendChild(btnNextElement);
      paginationContainer.appendChild(nextElement);
    }

    // end button back ⬅
  }
  renderSearch() {
    const form = document.createElement('form');
    form.className = 'mb-3 mx-auto'; // центрування через margin auto
    form.style.maxWidth = '400px'; // максимальна ширина
    form.setAttribute('role', 'search');
    form.addEventListener('submit', e => e.preventDefault());

    const label = document.createElement('label');
    label.className = 'visually-hidden';
    label.setAttribute('for', 'input-search');
    label.textContent = 'Search';

    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'input-search';
    input.className = 'form-control shadow-sm'; // додаємо легку тінь
    input.placeholder = 'Search books by title, author, or year';
    input.style.width = '100%';
    input.style.borderRadius = '8px'; // закруглення
    input.style.padding = '8px 12px';

    // обробник пошуку
    input.addEventListener('input', e => {
      if (this.onSearch) {
        this.onSearch(e.target.value);
      }
    });

    form.append(label, input);

    // додаємо ПЕРЕД таблицею
    const prependTable = document.querySelector('#title');
    prependTable.insertAdjacentElement('afterend', form);
  }
}

//тільки DOM
