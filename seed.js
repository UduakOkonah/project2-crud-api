require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/user");
const Book = require("./models/book");


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected for seeding"))
  .catch((err) => console.error(err));

// Sample data
const users = [
  { name: "Uduak Okonah", email: "uduak@example.com", age: 21, role: "user" },
  { name: "John Doe", email: "john@example.com", age: 25, role: "admin" },
  { name: "Jane Smith", email: "jane@example.com", age: 30, role: "user" }
];

const books = [
  { title: "Learn MongoDB", author: "Jane Doe", year: 2024, isbn: "123-456789", genre: "Tech", rating: 5 },
  { title: "Mastering Node.js", author: "John Smith", year: 2023, isbn: "987-654321", genre: "Programming", rating: 4 },
  { title: "Express in Action", author: "Alex Johnson", year: 2022, isbn: "555-888999", genre: "Web Dev", rating: 5 }
];

// Insert sample data
const seedData = async () => {
  try {
    await User.deleteMany();
    await Book.deleteMany();

    await User.insertMany(users);
    await Book.insertMany(books);

    console.log("🌱 Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedData();
