const express = require("express");
const router = express.Router();
const booksController = require("../controllers/booksController.js");
const Joi = require("joi");
const { requireAuth, requireRole } = require("../middleware/auth");

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

const bookSchema = Joi.object({
  title: Joi.string().min(3).required(),
  author: Joi.string().min(3).required(),
  isbn: Joi.string().min(5).required(),
  publishedDate: Joi.date().iso().required(),
  genre: Joi.string().min(3).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});

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
 *     summary: Create a new book (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
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
 *     responses:
 *       200:
 *         description: Book found
 *   put:
 *     summary: Update a book by ID (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *   delete:
 *     summary: Delete a book by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 */

router.get("/", booksController.getBooks);
router.get("/:id", booksController.getBook);

// ✅ Protected & validated create
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const newBook = await booksController.createBook(req, res);
  } catch (err) {
    next(err);
  }
});

// ✅ Protected & validated update
router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { error } = bookSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const updatedBook = await booksController.updateBook(req, res);
  } catch (err) {
    next(err);
  }
});

// ✅ Admin-only delete
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const deleted = await booksController.deleteBook(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;