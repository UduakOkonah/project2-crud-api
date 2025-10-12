const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { signUser } = require("../utils/jwt");

// ✅ GET all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET one user
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ CREATE user
exports.createUser = async (req, res) => {
  try {
    const data = req.body.validated || req.body; // use validated data from router if present

    // Hash password if provided (manual registration)
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    const user = new User(data);
    await user.save();

    // Generate JWT
    const token = signUser(user);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error("🔥 createUser error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE user (with debug logs)
  exports.updateUser = async (req, res) => {
    try {
      console.log("➡️ PUT /api/users/" + req.params.id + " received");
      console.log("➡️ Body:", req.body);

      // include role now
      const { name, email, age, role } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, age, role }, // update role too
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        console.log("❌ No user found for id:", req.params.id);
        return res.status(404).json({ error: "User not found" });
      }

      console.log("✅ Updated user:", updatedUser);
      return res.status(200).json(updatedUser);
    } catch (err) {
      console.error("🔥 updateUser error:", err);
      if (err.code === 11000) {
        return res.status(400).json({ error: "Email must be unique" });
      }
      return res.status(500).json({ error: err.message });
    }
  };



// ✅ DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};