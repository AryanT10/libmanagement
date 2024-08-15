import React, { useState, useEffect } from 'react';

export default function Home() {
	const [books, setBooks] = useState([]);
	const [borrowedBooks, setBorrowedBooks] = useState([]);
	const [returnedBooks, setReturnedBooks] = useState([]);
	const [isAddBookFormVisible, setAddBookFormVisible] = useState(false);
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [isEditing, setIsEditing] = useState(null); // Track which book is being edited
	const [isbn, setIsbn] = useState('');
	const [borrowTitle, setBorrowTitle] = useState('');
	const [borrowIsbn, setBorrowIsbn] = useState('');
	const [returnTitle, setReturnTitle] = useState('');
	const [returnIsbn, setReturnIsbn] = useState('');
	const [theme, setTheme] = useState('light');

	useEffect(() => {
		fetchBooks();
		fetchBorrowedBooks();
	}, []);

	const fetchBooks = () => {
		fetch('/api/books')
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch books');
				}
				return response.json();
			})
			.then(data => setBooks(data))
			.catch(error => console.error('Error fetching books:', error));
	};

	const editBook = (book) => {
		setIsEditing(book._id);
		setTitle(book.title);
		setAuthor(book.author);
		setIsbn(book.ISBN);
	};

	const fetchBorrowedBooks = () => {
		fetch('/api/transactions')
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to fetch borrowed books');
				}
				return response.json();
			})
			.then(data => {
				setBorrowedBooks(data.activeBorrows);
				setReturnedBooks(data.returnedBorrows);
			})
			.catch(error => console.error('Error fetching borrowed books:', error));
	};


	const addBook = () => {
		fetch('/api/books', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, author, ISBN: isbn })
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to add book');
				}
				return response.json();
			})
			.then(() => {
				fetchBooks();
				setAddBookFormVisible(false);
			})
			.catch(error => console.error('Error adding book:', error));
	};

	const deleteBook = (bookID) => {
		fetch(`/api/books?id=${bookID}`, {
			method: 'DELETE'
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to delete book');
				}
				return response.json();
			})
			.then(() => fetchBooks())
			.catch(error => console.error('Error deleting book:', error));
	};

	const borrowBook = () => {

		if (!borrowTitle || !borrowIsbn) {
			alert('Please provide both the title and ISBN');
			return;
		}

		fetch('/api/transactions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ action: 'borrow', title: borrowTitle, ISBN: borrowIsbn })
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to borrow book');
				}
				return response.json();
			})
			.then(() => {
				alert('Book borrowed successfully');
				fetchBooks();
				fetchBorrowedBooks(); // Re-fetch the borrowed and returned books to update the lists
			})
			.catch(error => console.error('Error borrowing book:', error));
	};

	const returnBook = () => {
		fetch('/api/transactions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ action: 'return', title: returnTitle, ISBN: returnIsbn })
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Failed to return book(Therer might be no recorded Borrow)');
				}
				return response.json();
			})
			.then(() => {
				alert('Book returned successfully');
				fetchBooks();
				fetchBorrowedBooks();
			})
			.catch(error => {
				console.error('Error returning book:', error.message);
				alert(error.message);  // This will show the popup with the error message
			});
	};

	const updateBook = (bookID) => {
		fetch(`/api/books?id=${bookID}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ title, author, ISBN: isbn })
		})
			.then(() => {
				fetchBooks();
				setIsEditing(null); // Reset editing state
			})
			.catch(error => console.error('Error updating book:', error));
	};

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light';
		setTheme(newTheme);
		document.body.className = newTheme;
	};

	return (
		<div className="app-container">
			{/* Title section */}
			<div className="header">
				<h1 className={theme === 'dark' ? 'dark' : ''}>Welcome to the Library Management System</h1>
				<button className={`btn btn-toggle ${theme === 'dark' ? 'dark' : ''}`} onClick={toggleTheme}> {theme === 'dark' ? (
            <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                ></path>
            </svg>
        ) : (
            <svg
                data-slot="icon"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                ></path>
            </svg>
				)}</button>
				<div className="quote">
				<p>Manage your books, borrow, and return them with ease.</p>
				</div>
			</div>

			{/* Add Book Section */}
			<div>
				<h2 className={theme === 'dark' ? 'dark' : ''}>Add a New Book</h2>
				<button className={`add-book-button ${theme === 'dark' ? 'dark' : ''}`} onClick={() => setAddBookFormVisible(true)}>Add New Book</button>

				{isAddBookFormVisible && (
					<form>
						<div>
							<label>Title: </label>
							<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
						</div>
						<div>
							<label>Author: </label>
							<input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
						</div>
						<div>
							<label>ISBN: </label>
							<input type="text" value={isbn} onChange={(e) => setIsbn(e.target.value)} />
						</div>
						<button className="btn btn-edit" type="button" onClick={addBook}>Submit</button>
						<button className="btn btn-delete" type="button" onClick={() => setAddBookFormVisible(false)}>Cancel</button>
					</form>
				)}
			</div>

			{/* Book List Section */}
			<h2 className={theme === 'dark' ? 'dark' : ''}>Available Books</h2>
			<div className="container">
				{books.map(book => (
					<div className="card" key={book._id}>
						<div className="card-body">
							{isEditing === book._id ? (
								// Edit form for the specific book
								<div>
									<input
										type="text"
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="Title"
									/>
									<input
										type="text"
										value={author}
										onChange={(e) => setAuthor(e.target.value)}
										placeholder="Author"
									/>
									<input
										type="text"
										value={isbn}
										onChange={(e) => setIsbn(e.target.value)}
										placeholder="ISBN"
									/>
									<button onClick={() => updateBook(book._id)} className="btn btn-edit">Save</button>
									<button onClick={() => setIsEditing(null)} className="btn btn-delete">Cancel</button>
								</div>
							) : (
								// Display book details with Edit and Delete buttons
								<div>
									<h3 className="card-title">{book.title}</h3>
									<p className="card-text">Author: {book.author}</p>
									<p className="card-text">ISBN: {book.ISBN}</p>
									<p className="card-text">Available Copies: {book.availableCopies}</p>
									<button className="btn btn-edit" onClick={() => editBook(book)}>Edit</button>
									<button className="btn btn-delete" onClick={() => deleteBook(book._id)}>Delete</button>
								</div>
							)}
						</div>
					</div>
				))}
			</div>

			{/* Borrow Book Section */}
			<div>
				<h2 className={theme === 'dark' ? 'dark' : ''}>Borrow a Book</h2>
				<input type="text" placeholder="Enter Book Title" value={borrowTitle} onChange={(e) => setBorrowTitle(e.target.value)} />
				<input type="text" placeholder="Enter ISBN" value={borrowIsbn} onChange={(e) => setBorrowIsbn(e.target.value)} />
				<button type="button" className="btn btn-edit" onClick={borrowBook}>Borrow Book</button>
			</div>

			{/* Return Book Section */}
			<div>
				<h2 className={theme === 'dark' ? 'dark' : ''}>Return a Book</h2>
				<input type="text" placeholder="Enter Book Title" value={returnTitle} onChange={(e) => setReturnTitle(e.target.value)} />
				<input type="text" placeholder="Enter ISBN" value={returnIsbn} onChange={(e) => setReturnIsbn(e.target.value)} />
				<button type="button" className="btn btn-delete" onClick={returnBook}>Return Book</button>
			</div>

			{/* Borrowed Books Section */}

			<h2 className={theme === 'dark' ? 'dark' : ''}>Borrowed Books</h2>
			<div id="borrowed-list">
				{borrowedBooks.map(transaction => (
					<div key={transaction._id} className="borrowed-item">
						<p>
							<strong>{transaction.bookTitle || 'Unknown Title'}</strong>
							{transaction.bookISBN ? ` (ISBN: ${transaction.bookISBN})` : ''}
							- Borrowed on {new Date(transaction.borrowDate).toLocaleDateString()}
						</p>
					</div>
				))}
			</div>

			{/* Returned Books Section */}
			<h2 className={theme === 'dark' ? 'dark' : ''}>Returned Books</h2>
			<div id="returned-list">
				{returnedBooks.map(transaction => (
					<div key={transaction._id} className="returned-item">
						<p><strong>{transaction.bookTitle}</strong> (ISBN: {transaction.bookISBN}) - Returned on {new Date(transaction.returnDate).toLocaleDateString()}</p>
					</div>
				))}
			</div>

		</div>
	);
}
