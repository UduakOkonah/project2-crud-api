const User = require("../models/user");

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
    const { name, email, age, role } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({ error: "Name, email, and age are required" });
    }
    const user = new User({ name, email, age, role });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email must be unique" });
    }
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE user (with debug logs)
exports.updateUser = async (req, res) => {
  try {
    console.log("➡️ PUT /api/users/" + req.params.id + " received");
    console.log("➡️ Body:", req.body);

    const { name, email, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
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
