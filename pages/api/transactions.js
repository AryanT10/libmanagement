import dbConnect from '../../utils/dbConnect';
import Book from '../../models/Book';
import Transaction from '../../models/Transaction';

export default async function handler(req, res) {
	const { method } = req;

	await dbConnect();

	switch (method) {
		case 'POST':  // For borrowing and returning books
			if (req.body.action === 'borrow') {
				return handleBorrow(req, res);
			} else if (req.body.action === 'return') {
				return handleReturn(req, res);
			} else {
				res.status(400).json({ message: 'Invalid action' });
			}
			break; x
		case 'GET':
			return handleGetBorrowedBooks(req, res);
		default:
			res.setHeader('Allow', ['GET', 'POST']);
			res.status(405).end(`Method ${method} Not Allowed`);
	}
}

async function handleBorrow(req, res) {
    const { title, ISBN } = req.body;

    try {
        // Validate that title and ISBN are provided
        if (!title || !ISBN) {
            return res.status(400).json({ message: 'Title and ISBN are required' });
        }

        // Trim spaces and search with case-insensitivity
        const book = await Book.findOne({
            title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },  // case-insensitive regex
            ISBN: ISBN.trim()
        });

        if (!book) {
            console.log(`Book not found for title: "${title.trim()}" and ISBN: "${ISBN.trim()}"`);
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.availableCopies <= 0) {
            return res.status(400).json({ message: 'No copies available to borrow' });
        }

        // Decrease the available copies count
        book.availableCopies -= 1;
        await book.save();

        // Create a new transaction with bookID
        const transaction = new Transaction({
            bookTitle: book.title, // Use the book's title from the database
            bookISBN: ISBN,
            bookID: book._id, // Add the bookID from the found book
            borrowDate: new Date(),
        });
        await transaction.save();

        res.status(200).json({ message: 'Book borrowed successfully', transaction });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}




async function handleReturn(req, res) {
    const { title, ISBN } = req.body;

    try {
        console.log(`Attempting to return book with title: "${title}" and ISBN: "${ISBN}"`);

        if (!title || !ISBN) {
            console.error('Title and ISBN are required for returning a book');
            return res.status(400).json({ message: 'Title and ISBN are required' });
        }

        const transaction = await Transaction.findOne({ bookTitle: title, bookISBN: ISBN, returnDate: null });
        
        if (!transaction) {
            console.error('No active borrow found for this book');
            return res.status(404).json({ message: 'No active borrow found for this book' });
        }

        transaction.returnDate = new Date();
        await transaction.save();

        const book = await Book.findOne({ title, ISBN });
        if (book) {
            book.availableCopies += 1;
            await book.save();
        }

        console.log('Book returned successfully');
        res.status(200).json({ message: 'Book returned successfully', transaction });
    } catch (err) {
        console.error('Error in handleReturn:', err.message);
        res.status(500).json({ message: err.message });
    }
}

async function handleGetBorrowedBooks(req, res) {
    try {
        const activeBorrows = await Transaction.find({ returnDate: null });
        const returnedBorrows = await Transaction.find({ returnDate: { $ne: null } });

        res.status(200).json({ activeBorrows, returnedBorrows });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

