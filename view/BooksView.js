export class BooksView {
  constructor(container) {
    this.container = container;
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
    this.container.innerHTML = `<td colspan="3" style="height:100px; vertical-align:middle;" class="text-center">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</td>`;
    setTimeout(() => {
      this.container.innerHTML = '';

      books.forEach((book, index) => {
        const tr = document.createElement('tr');

        const th = document.createElement('th');
        th.style.width = '50px';
        th.scope = 'row';
        th.textContent = index + 1 + (currentPage - 1) * perPage;

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

        tdAButtons.append(btnDetails, btnEdit, btnDelete);

        tr.appendChild(th);
        tr.appendChild(tdTitle);
        tr.appendChild(tdAButtons);

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
    inputAuthor.addEventListener('input', () => this._triggerFilter());
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
    genreSelect.addEventListener('change', () => {
      this._triggerFilter();
    });

    // accessible label for the select (visually hidden but available to screen readers)
    const genreLabel = document.createElement('label');
    genreLabel.htmlFor = 'filter-genre';
    genreLabel.className = 'form-label visually-hidden';
    genreLabel.textContent = 'Genre';

    divGenre.appendChild(genreLabel);
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
      this._triggerFilter();
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
      this._triggerFilter();
    });
    divYearTo.appendChild(yearTo);

    // Clear + export
    const divActions = document.createElement('div');
    divActions.className = 'col-12 col-md-auto d-flex gap-2';

    const btnClear = document.createElement('button');
    btnClear.type = 'button';
    btnClear.className = 'btn btn-outline-secondary';
    btnClear.textContent = 'Clear';
    btnClear.addEventListener('click', () => {
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
    btnAdd.addEventListener('click', () => this.onAdd && this.onAdd());

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

  _triggerFilter() {
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
