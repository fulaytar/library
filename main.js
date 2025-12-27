import { BooksModel } from './model/BooksModel.js';
import { BooksView } from './view/BooksView.js';
import { BooksController } from './controller/BooksController.js';

const model = new BooksModel();
const view = new BooksView(document.getElementById('books-table-body'));
const controller = new BooksController(model, view);
