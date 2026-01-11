export class BooksView {
  #container;
  #userName;
  constructor(container) {
    this.#container = container;
    this.onPageChange = null;
    this.onSearch = null;

    this.onFilter = null;
    this.onExport = null;

    this.onDetails = null;
    this.onEdit = null;
    this.onDelete = null;
    this.onAdd = null;

    this.renderSearch();
    this.renderFilters([]);
  }

  render(books, currentPage, perPage) {
    this.#container.innerHTML = '';
    this.#container.dataset.loading = 'false';

    books.forEach((book, index) => {
      const tr = document.createElement('tr');

      const th = document.createElement('th');
      th.scope = 'row';
      th.style.Width = '200px';
      th.className = 'align-middle';
      th.textContent = index + 1 + (currentPage - 1) * perPage;

      const tdTitle = document.createElement('td');
      const titleWrap = document.createElement('div');
      titleWrap.className = 'text-truncate d-inline-block w-80';
      titleWrap.textContent = book.title;
      tdTitle.appendChild(titleWrap);

      const tdAuthor = document.createElement('td');
      tdAuthor.className = 'w-25';
      const authorWrap = document.createElement('div');
      authorWrap.className = 'text-truncate d-inline-block w-100';
      authorWrap.textContent =
        book.author || (book.details && book.details.author) || '';
      tdAuthor.appendChild(authorWrap);

      const tdYear = document.createElement('td');
      tdYear.className = 'col-1';
      tdYear.textContent = book.year || '';

      const tdGenre = document.createElement('td');
      const genreWrap = document.createElement('div');
      genreWrap.className = 'text-truncate d-inline-block w-100';
      genreWrap.textContent =
        book.genre || (book.details && book.details.genre) || '';
      tdGenre.appendChild(genreWrap);

      const tdPages = document.createElement('td');
      tdPages.className = 'col-1 text-center';
      tdPages.textContent =
        book.pages !== undefined
          ? String(book.pages)
          : book.details && book.details.pages
          ? String(book.details.pages)
          : '';

      const tdAButtons = document.createElement('td');

      const btnDetails = document.createElement('button');
      btnDetails.className = 'btn btn-sm btn-info me-1';
      btnDetails.setAttribute('title', 'Details');
      btnDetails.setAttribute('aria-label', 'View details');
      btnDetails.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`;
      btnDetails.addEventListener('click', () => {
        if (this.#userName === undefined || this.#userName === '')
          return alert('Please enter your name');
        if (this.onDetails) this.onDetails(index);
      });

      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn btn-sm btn-warning me-1';
      btnEdit.setAttribute('title', 'Edit');
      btnEdit.setAttribute('aria-label', 'Edit book');
      // quill / feather icon (inline SVG, using currentColor)
      btnEdit.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 21l1.5-4.5L17.5 3.5l3 3L7.5 20.5 3 21zM20.7 7.3l-4-4 1.4-1.4 4 4-1.4 1.4z"/></svg>`;
      btnEdit.addEventListener('click', () => {
        if (this.#userName === undefined || this.#userName === '')
          return alert('Please enter your name');
        if (this.onEdit) this.onEdit(index);
      });

      const btnDelete = document.createElement('button');
      btnDelete.className = 'btn btn-sm btn-danger me-1';
      btnDelete.setAttribute('title', 'Delete');
      btnDelete.setAttribute('aria-label', 'Delete book');
      btnDelete.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 7h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7zm3-4h6l1 1H8l1-1zM9 9v9h2V9H9zm4 0v9h2V9h-2z"/></svg>`;
      btnDelete.addEventListener('click', () => {
        if (this.#userName === undefined || this.#userName === '')
          return alert('Please enter your name');
        if (this.onDelete) this.onDelete(index);
      });

      tdAButtons.append(btnDetails, btnEdit, btnDelete);

      tr.appendChild(th);
      tr.appendChild(tdTitle);
      tr.appendChild(tdAuthor);
      tr.appendChild(tdYear);
      tr.appendChild(tdGenre);
      tr.appendChild(tdPages);
      tr.appendChild(tdAButtons);

      this.#container.appendChild(tr);
    });
  }

  showLoading() {
    this.#container.dataset.loading = 'true';
    this.#container.innerHTML = `
      <tr>
        <td colspan="7" class="text-center align-middle py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </td>
      </tr>
    `;
  }

  hideLoading() {
    if (this.#container.dataset.loading === 'true') {
      this.#container.innerHTML = '';
      this.#container.dataset.loading = 'false';
    }
  }

  renderPagination(totalPages, currentPage, onPageChange) {
    let paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) {
      paginationContainer = document.createElement('ul');
      paginationContainer.id = 'pagination';
      paginationContainer.className = 'pagination justify-content-center';
      this.#container.parentNode.appendChild(paginationContainer);
    }
    paginationContainer.innerHTML = '';

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

    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage >= 4) {
        pages.push('...');
      }

      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (currentPage <= totalPages - 3) {
        pages.push('...');
      }

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
  }

  renderSearch() {
    // If form already exists, do not recreate; keep inputs and wiring
    let container = document.getElementById('search-filters-block');
    if (container) return;

    container = document.createElement('div');
    container.id = 'search-filters-block';
    container.className = 'mt-4';

    // Use Bootstrap responsive row for a single, nice block
    const form = document.createElement('form');
    form.className = 'row g-2 align-items-center';
    form.setAttribute('role', 'search');
    form.addEventListener('submit', e => e.preventDefault());

    // Search input (main, larger)
    const divSearch = document.createElement('div');
    divSearch.className = 'col-12 col-sm-6 col-md-2';
    const input = document.createElement('input');
    input.type = 'search';
    input.id = 'input-search';
    input.className = 'form-control ';
    input.placeholder = 'Search by title';
    input.style.borderRadius = '8px';
    input.addEventListener('input', e => {
      if (this.onSearch) this.onSearch(e.target.value);
    });
    divSearch.appendChild(input);

    // Author filter
    const divAuthor = document.createElement('div');
    divAuthor.className = 'col-12 col-sm-6 col-md-2';
    const inputAuthor = document.createElement('input');
    inputAuthor.type = 'text';
    inputAuthor.id = 'filter-author';
    inputAuthor.className = 'form-control';
    inputAuthor.placeholder = 'Author';
    inputAuthor.addEventListener('input', () => this.#triggerFilter());
    divAuthor.appendChild(inputAuthor);

    // Genre filter
    const divGenre = document.createElement('div');
    divGenre.className = 'col-12 col-sm-6 col-md-2';
    const genreSelect = document.createElement('select');
    genreSelect.id = 'filter-genre';
    genreSelect.className = 'form-select';
    // create default option instead of using innerHTML
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = 'Any genre';
    genreSelect.appendChild(defaultOpt);
    // accessibility attribute (English label as requested)
    genreSelect.setAttribute('aria-label', 'Genre');
    genreSelect.addEventListener('change', () => {
      this.#triggerFilter();
    });

    divGenre.appendChild(genreSelect);

    // Year range
    const divYearFrom = document.createElement('div');
    divYearFrom.className = 'col-6 col-md-1';
    const yearFrom = document.createElement('input');
    yearFrom.type = 'number';
    yearFrom.id = 'filter-year-from';
    yearFrom.className = 'form-control';
    yearFrom.placeholder = 'From';
    yearFrom.min = '0';
    yearFrom.step = '1';
    yearFrom.inputMode = 'numeric';
    // block +, -, e/E on keydown
    yearFrom.addEventListener('keydown', e => {
      if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-')
        e.preventDefault();
    });
    // sanitize pasted content (allow only digits)
    yearFrom.addEventListener('paste', e => {
      const text = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^\d*$/.test(text)) e.preventDefault();
    });
    // sanitize on input (keeps only digits)
    yearFrom.addEventListener('input', () => {
      if (yearFrom.value !== '')
        yearFrom.value = yearFrom.value.replace(/[^\d]/g, '');
      this.#triggerFilter();
    });
    divYearFrom.appendChild(yearFrom);

    const divYearTo = document.createElement('div');
    divYearTo.className = 'col-6 col-md-1';
    const yearTo = document.createElement('input');
    yearTo.type = 'number';
    yearTo.id = 'filter-year-to';
    yearTo.className = 'form-control';
    yearTo.placeholder = 'To';
    yearTo.min = '0';
    yearTo.step = '1';
    yearTo.inputMode = 'numeric';
    yearTo.addEventListener('keydown', e => {
      if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-')
        e.preventDefault();
    });
    yearTo.addEventListener('paste', e => {
      const text = (e.clipboardData || window.clipboardData).getData('text');
      if (!/^\d*$/.test(text)) e.preventDefault();
    });
    yearTo.addEventListener('input', () => {
      if (yearTo.value !== '')
        yearTo.value = yearTo.value.replace(/[^\d]/g, '');
      this.#triggerFilter();
    });
    divYearTo.appendChild(yearTo);

    // Clear + export
    const divActions = document.createElement('div');
    divActions.className = 'col-12 col-md-auto d-flex gap-2';

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'btn btn-outline-secondary';
    btnClear.textContent = 'Clear';
    btnClear.title = 'Clear search and filters';

    btnClear.addEventListener('click', () => {
      // Read current values
      const searchVal = (input.value || '').trim();
      const authorVal = (inputAuthor.value || '').trim();
      const genreVal = (genreSelect.value || '').trim();
      const yearFromVal = (yearFrom.value || '').trim();
      const yearToVal = (yearTo.value || '').trim();

      if (!searchVal && !authorVal && !genreVal && !yearFromVal && !yearToVal)
        return;

      input.value = '';
      inputAuthor.value = '';
      genreSelect.value = '';
      yearFrom.value = '';
      yearTo.value = '';
      if (this.onSearch) this.onSearch('');
      if (this.onFilter)
        this.onFilter({ author: '', genre: '', yearFrom: '', yearTo: '' });
    });

    // Export dropdown
    const exportWrapper = document.createElement('div');
    exportWrapper.className = 'btn-group';

    const exportBtn = document.createElement('button');
    exportBtn.title = 'Export books';
    exportBtn.className = 'btn btn-outline-primary dropdown-toggle';
    exportBtn.setAttribute('data-bs-toggle', 'dropdown');
    exportBtn.textContent = 'Export';

    const exportMenu = document.createElement('ul');
    exportMenu.className = 'dropdown-menu';

    const makeExportItem = (label, format, scope) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dropdown-item';
      a.href = '#';
      a.textContent = label;
      a.addEventListener('click', e => {
        e.preventDefault();
        if (this.onExport) this.onExport({ format, scope });
      });
      li.appendChild(a);
      exportMenu.appendChild(li);
    };

    makeExportItem('CSV (all)', 'csv', 'all');
    makeExportItem('CSV (current page)', 'csv', 'page');
    makeExportItem('JSON (all)', 'json', 'all');
    makeExportItem('JSON (current page)', 'json', 'page');

    exportWrapper.append(exportBtn, exportMenu);

    // Add button (visible, inline with filters)
    const btnAdd = document.createElement('button');
    btnAdd.type = 'button';
    btnAdd.className = 'btn btn-success';
    btnAdd.textContent = 'Add book';
    btnAdd.title = 'Add a new book';
    btnAdd.addEventListener('click', () => {
      if (this.#userName === undefined || this.#userName === '')
        return alert('Please enter your name');
      if (this.onAdd) this.onAdd();
    });

    divActions.appendChild(btnAdd);
    divActions.appendChild(btnClear);
    divActions.appendChild(exportWrapper);

    form.append(
      divSearch,
      divAuthor,
      divGenre,
      divYearFrom,
      divYearTo,
      divActions
    );

    container.appendChild(form);

    const prependTable = document.querySelector('#title');
    prependTable.insertAdjacentElement('afterend', container);
  }

  // Public: render top info header (user name)
  renderHeader({ userName = '' } = {}) {
    let header = document.getElementById('top-info');
    if (!header) {
      header = document.createElement('div');
      header.id = 'top-info';
      header.className =
        'd-flex justify-content-between align-items-center mb-3';
      const prependTarget = document.querySelector('#title');
      prependTarget.insertAdjacentElement('afterend', header);
    }

    // Restore from localStorage if available
    if (!this.#userName) {
      try {
        const stored = localStorage.getItem('library_userName');
        if (stored) this.#userName = stored;
      } catch (e) {
        console.error('Failed to access localStorage', e);
      }
    }

    header.innerHTML = '';

    // Inject small stylesheet for header if not present (keeps inline styles out of DOM)
    if (!document.getElementById('booksview-header-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'booksview-header-styles';
      styleEl.textContent =
        '.header-name-input { min-width: 160px; } .header-name-error { color: #dc3545; font-size: 0.875rem; margin-top: 0.25rem; }';
      document.head.appendChild(styleEl);
    }

    const left = document.createElement('div');
    const right = document.createElement('div');
    left.className = 'd-flex align-items-center';
    right.id = 'analytics-summary';
    right.className = 'text-muted small';

    const saveName = () => {
      const input = document.getElementById('header-name-input');
      if (!input) return;
      const v = input.value.trim();

      // Validation: disallow digits in name
      const hasDigits = /\d/.test(v);
      let errEl = document.getElementById('header-name-error');

      if (!v) {
        if (!errEl) {
          errEl = document.createElement('div');
          errEl.id = 'header-name-error';
          errEl.className = 'header-name-error';
          errEl.textContent = 'Please enter your name';
          input.insertAdjacentElement('afterend', errEl);
        } else {
          errEl.textContent = 'Please enter your name';
          errEl.classList.add('d-block');
        }
        input.classList.add('is-invalid');
        return;
      }

      if (hasDigits) {
        if (!errEl) {
          errEl = document.createElement('div');
          errEl.id = 'header-name-error';
          errEl.className = 'header-name-error';
          errEl.textContent = 'Name cannot contain numbers';
          input.insertAdjacentElement('afterend', errEl);
        } else {
          errEl.textContent = 'Name cannot contain numbers';
          errEl.classList.add('d-block');
        }
        input.classList.add('is-invalid');
        return;
      }

      // Clear any previous error
      if (errEl) {
        errEl.remove();
      }
      input.classList.remove('is-invalid');

      this.#userName = v;
      try {
        localStorage.setItem('library_userName', v);
      } catch (e) {
        console.error('Failed to access localStorage', e);
      }
      this.renderHeader();
    };

    if (this.#userName) {
      const strong = document.createElement('strong');
      strong.textContent = `Welcome, ${this.#userName}`;
      left.appendChild(strong);

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-link btn-sm ms-2';
      editBtn.setAttribute('title', 'Edit name');
      editBtn.setAttribute('aria-label', 'Edit name');
      editBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 21l1.5-4.5L17.5 3.5l3 3L7.5 20.5 3 21zM20.7 7.3l-4-4 1.4-1.4 4 4-1.4 1.4z"/></svg>`;
      editBtn.addEventListener('click', () => {
        this.#userName = '';
        try {
          localStorage.removeItem('library_userName');
        } catch (e) {}
        this.renderHeader();
      });
      left.appendChild(editBtn);
    } else {
      const label = document.createElement('label');
      label.htmlFor = 'header-name-input';
      label.className = 'me-0 mb-0';
      label.textContent = '';

      const input = document.createElement('input');
      input.type = 'text';
      input.id = 'header-name-input';
      input.placeholder = 'Please enter your name';
      input.className =
        'form-control d-inline-block w-auto header-name-input me-2';

      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          saveName();
        }
      });

      input.addEventListener('input', () => {
        input.classList.remove('is-invalid');
        const err = document.getElementById('header-name-error');
        if (err) err.remove();
      });

      input.addEventListener('blur', () => saveName());

      left.appendChild(label);
      left.appendChild(input);

      // focus promptly
      setTimeout(() => input.focus(), 0);
    }

    header.appendChild(left);
    header.appendChild(right);
  }

  // Public: render analytics data
  renderAnalytics(analytics = { totalBooks: 0, genres: {} }) {
    const container = document.getElementById('analytics-summary');
    if (!container) return;
    const { totalBooks, genres } = analytics;
    const genrePairs = Object.entries(genres).sort((a, b) => b[1] - a[1]);
    const topGenres = genrePairs
      .slice(0, 3)
      .map(([g, c]) => `${g}: ${c}`)
      .join(' • ');
    container.textContent = `Total books: ${totalBooks}${
      topGenres ? ' • ' + topGenres : ''
    }`;
  }

  // Public getter for current username (empty string if not set)
  getUserName() {
    return this.#userName || '';
  }

  renderFilters(genres = [], selectedGenre = '') {
    // We now have combined search+filters block; just populate the genre select
    // If the combined block does not exist yet, create it
    const block = document.getElementById('search-filters-block');
    if (!block) {
      // create the combined block and then re-call to populate genres
      this.renderSearch();
    }

    const genreSelect = document.querySelector('#filter-genre');
    if (!genreSelect) return;

    // clear existing options and add default
    genreSelect.innerHTML = '';
    const any = document.createElement('option');
    any.value = '';
    any.textContent = 'Any genre';
    genreSelect.appendChild(any);

    genres.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g;
      opt.textContent = g;
      genreSelect.appendChild(opt);
    });

    // restore previously selected genre if provided and still present
    if (
      selectedGenre &&
      Array.from(genreSelect.options).some(o => o.value === selectedGenre)
    ) {
      genreSelect.value = selectedGenre;
    } else {
      genreSelect.value = '';
    }
  }

  #triggerFilter() {
    const author = (document.getElementById('filter-author') || {}).value || '';
    const genre = (document.getElementById('filter-genre') || {}).value || '';
    const yearFrom =
      (document.getElementById('filter-year-from') || {}).value || '';
    const yearTo =
      (document.getElementById('filter-year-to') || {}).value || '';

    if (this.onFilter) {
      this.onFilter({
        author: author.trim(),
        genre,
        yearFrom: yearFrom !== '' ? Number(yearFrom) : '',
        yearTo: yearTo !== '' ? Number(yearTo) : '',
      });
    }
  }

  renderFiltersWithGenres(genres, selectedGenre = '') {
    this.renderFilters(genres, selectedGenre);
  }
}
//тільки DOM
