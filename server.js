// ✅ Load environment variables first
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const passport = require("passport");

// Auth middleware
const { requireAuth, requireRole } = require("./middleware/auth");

// Routers
const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");
const authRouter = require("./routes/auth");

// Passport config
require("./config/passport")(passport);

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());

// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Project 2 API",
      version: "1.0.0",
      description: "CRUD API with Users and Books + Authentication & Validation",
    },
    servers: [
      { url: `http://localhost:${PORT}/api` },
      { url: "https://crud-api-5ytk.onrender.com/api" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root
app.get("/", (req, res) => {
  res.send("🚀 Welcome to Project 2 CRUD API! Visit /api-docs for Swagger docs.");
});

// Routes
app.use("/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/books", booksRouter);

// Protected route example
app.get("/api/secret", requireAuth, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}, this is protected.` });
});

// Admin-only route
app.delete("/api/admin-only", requireAuth, requireRole("admin"), (req, res) => {
  res.json({ message: "Admin privilege confirmed." });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)))
  .catch((err) => console.error("MongoDB connection error:", err));

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
