const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    ISBN: String,
    availableCopies: { type: Number, default: 1 },
});

module.exports = mongoose.models.Book || mongoose.model('Book', bookSchema);
