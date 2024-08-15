import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
	bookTitle: { type: String, required: true },
    bookISBN: { type: String, required: true },
	borrowDate: { type: Date, default: Date.now },
	returnDate: { type: Date },
});

export default mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
