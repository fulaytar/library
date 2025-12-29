export class BooksView {
  constructor(container, addBook, onDelete, onEdit, onDetails) {
    this.container = container;
    this.onPageChange = null;
    /*    this.addBook = addBook;
    this.onDelete = onDelete;
    this.onEdit = onEdit;
    this.onDetails = onDetails; */
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
        console.log(currentPage);

        // назва книги
        const tdTitle = document.createElement('td');
        tdTitle.textContent = book.title;
        tdTitle.style.cursor = 'pointer';

        /*         // кнопки
        const tdButtons = document.createElement('td');

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-sm btn-primary mx-1';
        editBtn.textContent = 'Редагувати';
        editBtn.addEventListener('click', () => this.onEdit(index));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-sm btn-danger';
        deleteBtn.textContent = 'Видалити';
        deleteBtn.addEventListener('click', () => this.onDelete(index));

        // Деталі
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn btn-sm btn-info mx-1';
        detailsBtn.textContent = 'Деталі';
        detailsBtn.addEventListener('click', () => this.onDetails(index));

        // додаємо кнопки в td
        tdButtons.appendChild(editBtn);
        tdButtons.appendChild(deleteBtn);
        tdButtons.appendChild(detailsBtn); */

        // збираємо рядок
        tr.appendChild(th);
        tr.appendChild(tdTitle);
        /*         tr.appendChild(tdButtons); */

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

    //button back ⬅⬅
    if (currentPage > 2) {
      const toFirtElement = document.createElement('li');
      toFirtElement.classList.add('page-item');
      if (currentPage === 1) toFirtElement.classList.add('disabled');
      const btnToFirtElement = document.createElement('button');
      btnToFirtElement.className = 'page-link';
      btnToFirtElement.textContent = '<<';
      btnToFirtElement.addEventListener('click', () => {
        onPageChange(1);
      });
      toFirtElement.appendChild(btnToFirtElement);
      paginationContainer.appendChild(toFirtElement);
    }
    // end button back ⬅⬅

    //button firt pages ⬅
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
      if (currentPage > 4) {
        pages.push('...');
      }

      // middle pages (current -1, current, current +1)
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // right ellipsis
      if (currentPage < totalPages - 3) {
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
    // end button back ⬅

    if (currentPage !== totalPages) {
      const toLastPage = document.createElement('li');
      toLastPage.classList.add('page-item');
      if (currentPage === totalPages) toLastPage.classList.add('disabled');

      const btnToLastPage = document.createElement('button');
      btnToLastPage.className = 'page-link';
      btnToLastPage.textContent = '>>';
      btnToLastPage.addEventListener('click', () => {
        onPageChange(totalPages);
      });
      toLastPage.appendChild(btnToLastPage);
      paginationContainer.appendChild(toLastPage);
    }
  }
}

/* export class TaskView {
  constructor(container, onDelete) {
    this.container = container;
    this.onDelete = onDelete;
  }

  render(tasks) {
    this.container.innerHTML = '';

    tasks.forEach((task, index) => {
      const div = document.createElement('div');
      div.className =
        'alert alert-secondary d-flex justify-content-between align-items-center mt-2';

      // текст таску
      const taskText = document.createElement('span');
      taskText.textContent = task;

      // кнопка видалення
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🗑️';
      deleteBtn.className = 'btn btn-sm btn-danger';
      console.log(index);
      deleteBtn.addEventListener('click', () => this.onDelete(index));

      div.appendChild(taskText);
      div.appendChild(deleteBtn);

      this.container.appendChild(div);
    });
  }
} */
//тільки DOM
