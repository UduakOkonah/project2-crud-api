const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    publishedDate: { type: Date, required: true }, // ← matches Swagger now
    genre: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
