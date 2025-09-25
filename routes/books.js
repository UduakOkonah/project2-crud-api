const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController");

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - isbn
 *         - publishedDate
 *         - genre
 *         - rating
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Author of the book
 *         isbn:
 *           type: string
 *           description: Unique ISBN
 *         publishedDate:
 *           type: string
 *           format: date
 *           description: Date the book was published (YYYY-MM-DD)
 *         genre:
 *           type: string
 *           description: Genre of the book
 *         rating:
 *           type: integer
 *           format: int32
 *           description: Rating of the book (1-5)
 *       example:
 *         title: The Great Gatsby
 *         author: F. Scott Fitzgerald
 *         isbn: "123-456789"
 *         publishedDate: "1925-04-10"
 *         genre: Fiction
 *         rating: 5
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of books
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           example:
 *             title: To Kill a Mockingbird
 *             author: Harper Lee
 *             isbn: "987-654321"
 *             publishedDate: "1960-07-11"
 *             genre: Classic
 *             rating: 5
 *     responses:
 *       201:
 *         description: Book created successfully
 *
 * /books/{id}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Book found
 *   put:
 *     summary: Update a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *           example:
 *             title: The Great Gatsby (Updated)
 *             author: F. Scott Fitzgerald
 *             isbn: "123-456789"
 *             publishedDate: "1925-04-10"
 *             genre: Classic Fiction
 *             rating: 4
 *     responses:
 *       200:
 *         description: Book updated successfully
 *   delete:
 *     summary: Delete a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted
 */

router.get("/", booksController.getBooks);
router.get("/:id", booksController.getBook);
router.post("/", booksController.createBook);
router.put("/:id", booksController.updateBook);
router.delete("/:id", booksController.deleteBook);

module.exports = router;
