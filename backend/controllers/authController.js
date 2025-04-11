const User = require("../models/user");
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



//signup a new user
exports.signup = async (req, res) => {

  console.log("Signup attempt:", req.body); // Log the request body for debugging 

  const { name, email, password } = req.body;

  try {
    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    //if not, create new user
    const newUser = new User({ name, email, password });
    await newUser.save(); // password gets hashed via pre-save hook


     // 3. Generate JWT token
     const payload = {
      id: newUser._id,
      email: newUser.email,
      name: newUser.name,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1h" });

    res.json({ accessToken: token });
  } catch (error) {
    console.error("Signup error", error);
    res.status(500).json({ message: "Signup Failed", error: error.message });
  }
   
}
