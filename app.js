// Storage Controller
const StorageCtrl = (() => {
	return {
		getBooksLS: () => {
			let books;

			if (localStorage.getItem('books') === null) {
				books = [];
			} else {
				books = JSON.parse(localStorage.getItem('books'));
			}

			return books;
		},
		addBookLS: (book) => {
			let books;

			if (localStorage.getItem('books') === null) {
				books = [];

				books.push(book);

				localStorage.setItem('books', JSON.stringify(books));
			} else {
				books = JSON.parse(localStorage.getItem('books'));

				books.push(book);

				localStorage.setItem('books', JSON.stringify(books));
			}
		},
		updateBookLS: (updatedBook) => {
			let books = StorageCtrl.getBooksLS();

			const ids = books.map((book) => {
				return book.id;
			});

			const index = ids.indexOf(updatedBook.id);

			books.splice(index, 1, updatedBook);

			localStorage.setItem('books', JSON.stringify(books));
		},
		deleteBookLS: (id) => {
			const books = JSON.parse(localStorage.getItem('books'));

			const ids = books.map((book) => {
				return book.id;
			});

			const index = ids.indexOf(id);

			books.splice(index, 1);

			localStorage.setItem('books', JSON.stringify(books));
		},
		clearBooksLS: () => {
			localStorage.removeItem('books');
		}
	};
})();

// Book Controller
const BookCtrl = (() => {
	// Book constructor
	const Book = function (id, bookName, author, year, isbn) {
		this.id = id;
		this.bookName = bookName;
		this.author = author;
		this.year = year;
		this.isbn = isbn;
	};

	// Data structure
	const data = {
		// books: [
		// 	{ id: 0, bookName: 'Book One', author: 'John Doe', year: 1000, isbn: 100 },
		// 	{ id: 1, bookName: 'Book Two', author: 'Walker Smith', year: 2000, isbn: 200 },
		// 	{ id: 2, bookName: 'Book Three', author: 'William Grey', year: 3000, isbn: 300 }
		// ],
		books: StorageCtrl.getBooksLS(),
		currentBook: null
	};

	return {
		logData: () => {
			console.log(data);
		},
		getBooks: () => {
			return data.books;
		},
		addBookData: (bookName, author, year, isbn) => {
			// Generate id
			let id = 0;
			if (data.books.length !== 0) {
				id = data.books[data.books.length - 1].id + 1;
			}

			// Convert datas to valid number
			year = parseInt(year);
			isbn = parseInt(isbn);

			// Construct book
			const book = new Book(id, bookName, author, year, isbn);

			data.books.push(book);

			return book;
		},
		updateBookData: (bookName, author, year, isbn) => {
			// Get current item's id
			const id = data.currentBook.id;

			const ids = data.books.map((book) => {
				return book.id;
			});

			const index = ids.indexOf(id);

			// Convert datas into valid number
			year = parseInt(year);
			isbn = parseInt(isbn);

			const updatedBook = new Book(id, bookName, author, year, isbn);

			data.books.splice(index, 1, updatedBook);

			return updatedBook;
		},
		deleteBookData: () => {
			// Get current book's id
			const id = data.currentBook.id;

			data.books.forEach((book, index) => {
				if (book.id === id) {
					data.books.splice(index, 1);
				}
			});

			return id;
		},
		clearBooksData: () => {
			data.books = [];
		},
		setCurrentBook: (bookId) => {
			let found = null;

			data.books.forEach((book) => {
				if (`book-${book.id}` === bookId) {
					data.currentBook = book;
					found = book;
				}
			});

			return found;
		}
	};
})();

// UI Controller
const UICtrl = (() => {
	const selectors = {
		bookList: '.book-list',
		bookListItems: '.book-list tr',
		bookNameInput: '#book-name',
		authorInput: '#author',
		year: '#year',
		isbn: '#isbn',
		btnAdd: '.btn-add',
		btnUpdate: '.btn-update',
		btnDelete: '.btn-delete',
		btnBack: '.btn-back',
		clearBtn: '.clear-btn',
		booklistFilter: '#booklist-filter',
		bookName: '.book-name',
		author: '.author',
		booklistContainer: '.booklist-container'
	};

	return {
		showAllBooks: (books) => {
			let output = '';

			books.forEach((book, index) => {
				output += `
               <tr id="book-${book.id}">
                  <th scope="row">${++index}</th>
                  <td class="book-name">${book.bookName}</td>
                  <td class="author">${book.author}</td>
                  <td>${book.year}</td>
                  <td>${book.isbn}</td>
                  <td>
                     <i class="btn-edit fas fa-pen"></i>
                  </td>
               </tr>
            `;
			});

			document.querySelector(selectors.bookList).innerHTML = output;
		},
		addBookToUI: (book) => {
			// Get book list items
			const bookListItems = document.querySelectorAll(selectors.bookListItems);

			// Generate id
			const bookNumber = bookListItems.length + 1;

			const tr = document.createElement('tr');
			tr.id = `book-${book.id}`;
			tr.innerHTML = `
			   <th scope='row'>${bookNumber}</th>
			   <td class="book-name">${book.bookName}</td>
			   <td class="author">${book.author}</td>
			   <td>${book.year}</td>
            <td>${book.isbn}</td>
            <td>
               <i class="btn-edit fas fa-pen"></i>
            </td>
			`;

			document.querySelector(selectors.bookList).insertAdjacentElement('beforeend', tr);
		},
		updateBookUI: (updatedBook) => {
			// Get book list items
			let bookListItems = document.querySelectorAll(selectors.bookListItems);

			// Generate id
			const bookNumber = bookListItems.length + 1;

			bookListItems = Array.from(bookListItems);

			bookListItems.forEach((bookListItem) => {
				if (bookListItem.id === `book-${updatedBook.id}`) {
					bookListItem.innerHTML = `
                  <th scope='row'>${bookNumber}</th>
                  <td class="book-name">${updatedBook.bookName}</td>
                  <td class="author">${updatedBook.author}</td>
                  <td>${updatedBook.year}</td>
                  <td>${updatedBook.isbn}</td>
                  <td>
                     <i class="btn-edit fas fa-pen"></i>
                  </td>
               `;
				}
			});
		},
		deleteBookUI: (id) => {
			document.querySelector(`#book-${id}`).remove();
		},
		clearBooksUI: () => {
			document.querySelector(selectors.bookList).innerHTML = '';
		},
		showAddState: () => {
			FormCtrl.clearFields();
			document.querySelector(selectors.btnAdd).style.display = 'block';
			document.querySelector(selectors.btnUpdate).style.display = 'none';
			document.querySelector(selectors.btnDelete).style.display = 'none';
			document.querySelector(selectors.btnBack).style.display = 'none';
		},
		showEditState: () => {
			FormCtrl.clearFields();
			document.querySelector(selectors.btnAdd).style.display = 'none';
			document.querySelector(selectors.btnUpdate).style.display = 'inline-block';
			document.querySelector(selectors.btnDelete).style.display = 'inline-block';
			document.querySelector(selectors.btnBack).style.display = 'inline-block';
		},
		hideBookList: () => {
			document.querySelector(selectors.booklistContainer).style.display = 'none';
		},
		showBookList: () => {
			document.querySelector(selectors.booklistContainer).style.display = 'block';
		},
		getSelectors: () => {
			return selectors;
		}
	};
})();

// Form Controller
const FormCtrl = (() => {
	// Get selectors
	const selectors = UICtrl.getSelectors();

	return {
		getInput: () => {
			return {
				bookName: document.querySelector(selectors.bookNameInput).value,
				author: document.querySelector(selectors.authorInput).value,
				year: document.querySelector(selectors.year).value,
				isbn: document.querySelector(selectors.isbn).value
			};
		},
		clearFields: () => {
			document.querySelector(selectors.bookNameInput).value = '';
			document.querySelector(selectors.authorInput).value = '';
			document.querySelector(selectors.year).value = '';
			document.querySelector(selectors.isbn).value = '';
		},
		showBookToForm: (book) => {
			document.querySelector(selectors.bookNameInput).value = book.bookName;
			document.querySelector(selectors.authorInput).value = book.author;
			document.querySelector(selectors.year).value = book.year;
			document.querySelector(selectors.isbn).value = book.isbn;
		}
	};
})();

// App
const App = ((StorageCtrl, BookCtrl, UICtrl, FormCtrl) => {
	// App methods
	// Add book submit
	const addBookSubmit = (e) => {
		// Get input
		const input = FormCtrl.getInput();

		if (input.bookName !== '' && input.author !== '' && input.year !== '' && input.isbn !== '') {
			// Add book to the data structure
			const book = BookCtrl.addBookData(input.bookName, input.author, input.year, input.isbn);

			// Add book to the UI
			UICtrl.addBookToUI(book);

			// Add book to LS
			StorageCtrl.addBookLS(book);

			// Show book list
			UICtrl.showBookList();

			// Clear fields
			FormCtrl.clearFields();
		}
		e.preventDefault();
	};

	// Edit book lick
	const editBookClick = (e) => {
		if (e.target.classList.contains('btn-edit')) {
			// Show edit state
			UICtrl.showEditState();

			// Get book list from UI
			const bookListId = e.target.parentNode.parentNode.id;

			// Set as current book
			const book = BookCtrl.setCurrentBook(bookListId);

			// Show current book to form
			FormCtrl.showBookToForm(book);
		}

		e.preventDefault();
	};

	// Update book submit
	const updateBookSubmit = (e) => {
		// Get user input
		const input = FormCtrl.getInput();

		if (input.bookName !== '' && input.author !== '' && input.year !== '' && input.isbn !== '') {
			// Update book in data structure
			const updatedBook = BookCtrl.updateBookData(input.bookName, input.author, input.year, input.isbn);

			// Update book in the UI from book list
			UICtrl.updateBookUI(updatedBook);

			// Update book in LS
			StorageCtrl.updateBookLS(updatedBook);

			// Show add state
			UICtrl.showAddState();
		}

		e.preventDefault();
	};

	// Delete book click
	const deleteBookClick = (e) => {
		// Delete book in the data structure
		const id = BookCtrl.deleteBookData();

		// Delete book in the UI from book list
		UICtrl.deleteBookUI(id);

		// Delete book in the LS
		StorageCtrl.deleteBookLS(id);

		// Show add state
		UICtrl.showAddState();

		// Hide book list if books in LS is empty
		if (StorageCtrl.getBooksLS().length === 0) {
			UICtrl.hideBookList();
		}

		e.preventDefault();
	};

	// Clear books click
	const clearBooksClick = (e) => {
		// Clear all books in the data structure
		BookCtrl.clearBooksData();

		// Clear all books in the UI from book list
		UICtrl.clearBooksUI();

		// Clear all books in the LS
		StorageCtrl.clearBooksLS();

		// Show ad state
		UICtrl.showAddState();

		// Hide book list
		UICtrl.hideBookList();

		e.preventDefault();
	};

	// Filter booklist
	const filterBooklist = (e) => {
		const selectors = UICtrl.getSelectors();

		const userInput = e.target.value;

		let bookListItems = document.querySelectorAll(selectors.bookListItems);

		bookListItems = Array.from(bookListItems);

		bookListItems.forEach((bookListItem) => {
			const bookName = bookListItem.querySelector(selectors.bookName).textContent;
			const author = bookListItem.querySelector(selectors.author).textContent;

			if (bookName.indexOf(userInput) === -1 && author.indexOf(userInput) === -1) {
				bookListItem.style.display = 'none';
			} else {
				bookListItem.style.display = 'table-row';
			}
		});
	};

	// Load event listeners
	const loadEventListeners = () => {
		// Get selectors form UICtrl
		const selectors = UICtrl.getSelectors();

		// Add btn
		document.querySelector(selectors.btnAdd).addEventListener('click', addBookSubmit);

		// Edit btns
		document.querySelector(selectors.bookList).addEventListener('click', editBookClick);

		// Update btn
		document.querySelector(selectors.btnUpdate).addEventListener('click', updateBookSubmit);

		// Delete btn
		document.querySelector(selectors.btnDelete).addEventListener('click', deleteBookClick);

		// Clear btn
		document.querySelector(selectors.clearBtn).addEventListener('click', clearBooksClick);

		// Back btn
		document.querySelector(selectors.btnBack).addEventListener('click', (e) => {
			UICtrl.showAddState();

			e.preventDefault();
		});

		// Book list filter
		document.querySelector(selectors.booklistFilter).addEventListener('keyup', filterBooklist);

		// Disable enter key
		document.addEventListener('keypress', (e) => {
			if (e.keyCode === 13 || e.which === 13) {
				e.preventDefault();
			}
		});
	};

	return {
		init: () => {
			const books = BookCtrl.getBooks();

			UICtrl.showAllBooks(books);

			// Show add state
			UICtrl.showAddState();

			// Hide book list if books in LS is empty
			if (StorageCtrl.getBooksLS().length === 0) {
				UICtrl.hideBookList();
			}

			// Load event listeners
			loadEventListeners();
		}
	};
})(StorageCtrl, BookCtrl, UICtrl, FormCtrl);

App.init();
