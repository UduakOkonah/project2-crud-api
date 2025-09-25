const Book = require("../models/book");

// ✅ GET all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET one book
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE book
exports.createBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedDate, genre, rating } = req.body;
    if (!title || !author || !isbn || !publishedDate || !genre) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }
    const book = new Book({ title, author, isbn, publishedDate, genre, rating });
    const savedBook = await book.save();
    res.status(201).json(savedBook);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "ISBN must be unique" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE book
exports.updateBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedDate, genre, rating } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, isbn, publishedDate, genre, rating },
      { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).json({ error: "Book not found" });
    res.status(200).json(updatedBook);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "ISBN must be unique" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ DELETE book
exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ error: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
