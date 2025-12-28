export class BooksView {
  constructor(container, addBook, onDelete, onEdit, onDetails) {
    this.container = container;
    this.onPageChange = null;
    /*    this.addBook = addBook;
    this.onDelete = onDelete;
    this.onEdit = onEdit;
    this.onDetails = onDetails; */
  }
  render(books) {
    this.container.innerHTML = `<td colspan="3" style="height:100px; vertical-align:middle;" class="text-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Завантаження...</span>
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
        th.textContent = index + 1;

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
    console.log(totalPages);
    let paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
      paginationContainer = document.createElement('ul');
      paginationContainer.id = 'pagination';
      paginationContainer.className = 'pagination justify-content-center';
      this.container.parentNode.appendChild(paginationContainer);
    }
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const li = document.createElement('li');
      li.className = `page-item ${i === currentPage ? 'active' : ''}`;

      const btn = document.createElement('button');
      btn.className = 'page-link';
      btn.textContent = i;
      btn.addEventListener('click', () => onPageChange(i));

      li.appendChild(btn);
      paginationContainer.appendChild(li);
    }

    /*     const nav = createElement('nav');
      const navList = createElement('ul');
      navList.classList.add('pagination justify-content-center');
      navList.id = 'pagination';
      nav.appendChild(navList);
      for (let i = currentPage; i <= lastPage; i++) {
        const buttonPage = createElement('button');
        buttonPage.textContent = currentPage;
        buttonPage.classList.add = 'page-link';
        navList.appendChild(`<li>${buttonPage}</li>`);
      } */
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
