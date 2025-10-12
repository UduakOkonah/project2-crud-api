const jwt = require("jsonwebtoken");

const signUser = (user) => {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = { signUser };
