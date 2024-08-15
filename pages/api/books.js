import dbConnect from '../../utils/dbConnect';
import Book from '../../models/Book';

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'GET':
			try {
				// Check if the collection is empty
				const bookCount = await Book.countDocuments();
				if (bookCount === 1) {
					// Populate the collection with sample data if it's empty
					const books = [
						{ title: 'To Kill a Mockingbird', author: 'Harper Lee', ISBN: '9780060935467', availableCopies: 4 },
						{ title: '1984', author: 'George Orwell', ISBN: '9780451524935', availableCopies: 5 },
						{ title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', ISBN: '9780743273565', availableCopies: 3 },
						{ title: 'Pride and Prejudice', author: 'Jane Austen', ISBN: '9781503290563', availableCopies: 7 },
						{ title: 'The Catcher in the Rye', author: 'J.D. Salinger', ISBN: '9780316769488', availableCopies: 6 },
						{ title: 'The Hobbit', author: 'J.R.R. Tolkien', ISBN: '9780547928227', availableCopies: 5 },
						{ title: 'Fahrenheit 451', author: 'Ray Bradbury', ISBN: '9781451673319', availableCopies: 4 },
						{ title: 'Moby Dick', author: 'Herman Melville', ISBN: '9781503280786', availableCopies: 2 },
						{ title: 'War and Peace', author: 'Leo Tolstoy', ISBN: '9781400079988', availableCopies: 3 },
						{ title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', ISBN: '9780140449136', availableCopies: 4 },
						{ title: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky', ISBN: '9780374528379', availableCopies: 3 },
						{ title: 'Brave New World', author: 'Aldous Huxley', ISBN: '9780060850524', availableCopies: 5 },
						{ title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', ISBN: '9780544003415', availableCopies: 6 },
						{ title: 'Animal Farm', author: 'George Orwell', ISBN: '9780451526342', availableCopies: 7 },
						{ title: 'Jane Eyre', author: 'Charlotte Brontë', ISBN: '9781503278196', availableCopies: 5 }
					];

					await Book.insertMany(books);
				}

				// Fetch all books
				const allBooks = await Book.find();
				res.status(200).json(allBooks);
			} catch (err) {
				res.status(500).json({ message: 'Error fetching books', error: err.message });
			}
			break;

		case 'POST':
			try {
				const { title, author, ISBN } = req.body;

				// Validation: Check if all required fields are present
				if (!title || !author || !ISBN) {
					return res.status(400).json({ message: 'Title, Author, and ISBN are required' });
				}

				const book = new Book({ title, author, ISBN, availableCopies: 1 });
				const newBook = await book.save();
				res.status(201).json(newBook);
			} catch (err) {
				res.status(400).json({ message: 'Error creating book', error: err.message });
			}
			break;

		case 'PUT':
			try {
				const { id } = req.query;
				const { title, author, ISBN } = req.body;

				// Validation: Check if ID is provided
				if (!id) {
					return res.status(400).json({ message: 'Book ID is required' });
				}

				const book = await Book.findById(id);
				if (!book) return res.status(404).json({ message: 'Cannot find book' });

				// Update fields
				if (title) book.title = title;
				if (author) book.author = author;
				if (ISBN) book.ISBN = ISBN;

				const updatedBook = await book.save();
				res.status(200).json(updatedBook);
			} catch (err) {
				res.status(400).json({ message: 'Error updating book', error: err.message });
			}
			break;

		case 'DELETE':
			try {
				const { id } = req.query;
				const deletedBook = await Book.findByIdAndDelete(id);
				if (!deletedBook) {
					return res.status(404).json({ message: 'Cannot find book' });
				}

				res.status(200).json({ message: 'Deleted Book' });
			} catch (err) {
				res.status(500).json({ message: err.message });
			}
			break;

		default:
			res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}
