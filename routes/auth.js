const express = require("express");
const router = express.Router();
const Joi = require("joi");
const User = require("../models/user");
const { signUser } = require("../utils/jwt");
const passport = require("passport");

// Joi schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().min(2).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const exists = await User.findOne({ email: value.email });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const user = new User(value);
    await user.save();

    const token = signUser(user);
    res.status(201).json({ token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.findOne({ email: value.email });
    if (!user || !(await user.comparePassword(value.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = signUser(user);
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    next(err);
  }
});

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/google/fail" }),
  (req, res) => {
    const token = signUser(req.user);
    res.redirect(`/auth/success?token=${token}`);
  }
);

router.get("/success", (req, res) => {
  const { token } = req.query;
  res.send(`
    <h2>✅ Google OAuth Successful!</h2>
    <p>Copy your JWT token below:</p>
    <code>${token}</code>
    <a href="/api-docs">Go to Swagger Docs</a>
  `);
});

router.get("/google/fail", (req, res) => res.status(401).json({ error: "Google auth failed" }));

router.get("/logout", (req, res) => res.json({ ok: true, message: "Logged out" }));

module.exports = router;
