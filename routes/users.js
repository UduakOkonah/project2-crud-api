const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const Joi = require("joi");
const { requireAuth, requireRole } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - age
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: number
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         password:
 *           type: string
 *           description: Required for manual registration
 *       example:
 *         name: Ima Okonah
 *         email: imaokonah@example.com
 *         age: 22
 *         role: user
 *         password: mysecret123
 */

// Manual registration schema (password required)
const manualUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(1).required(),
  role: Joi.string().valid("user", "admin").optional(),
  password: Joi.string().min(8).required(),
});

// Google user schema (password optional)
const googleUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(1).required(),
  role: Joi.string().valid("user", "admin").optional(),
});



/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *
 *   post:
 *     summary: Create a new user (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *
 *   put:
 *     summary: Update a user by ID (requires authentication)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
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
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *
 *   delete:
 *     summary: Delete a user by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

router.get("/", requireAuth, usersController.getUsers);
router.get("/:id", requireAuth, usersController.getUser);

// Create user (manual or Google)
router.post("/", async (req, res, next) => {
  try {
    let validated;
    if (req.body.password) {
      // Manual registration
      const { error, value } = manualUserSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      validated = value;
    } else {
      // Google user
      const { error, value } = googleUserSchema.validate(req.body);
      if (error) return res.status(400).json({ error: error.details[0].message });
      validated = value;
    }

    await usersController.createUser(req, res, validated);
  } catch (err) {
    next(err);
  }
});

// Update schema (password optional)
const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  age: Joi.number().integer().min(1).optional(),
  role: Joi.string().valid("user", "admin").optional(),
  password: Joi.string().min(8).optional(),
});

router.put("/:id", requireAuth, async (req, res, next) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    await usersController.updateUser(req, res, value); // pass validated data
  } catch (err) {
    next(err);
  }
});


// Admin-only delete
router.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    await usersController.deleteUser(req, res);
  } catch (err) {
    next(err);
  }
});

module.exports = router;