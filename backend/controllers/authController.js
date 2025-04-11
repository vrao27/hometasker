const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid password" });

    const payload = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1h" });

    res.json({ accessToken: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during login" });
  }
};
