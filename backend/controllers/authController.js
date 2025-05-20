const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Household = require('../models/houseHold');


exports.login = async (req, res) => { 
 const { email, password } = req.body;
   //find user based on email 
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "User not found" });

    //NOTE: use the method defined in the user model to compare the password
    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).json({ message: "Invalid password" });

    //NOte: use the method defined in the user model to generate the JWT token
    const token = user.generateAuthToken();
    // Send the token back to the client
    res.json({ accessToken: token });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Server error during login" });
  }

}


  //Updated SIGNUP method using model instance methods
exports.signup = async (req, res) => {
  //signup a new user
  const { name, email, password, householdId: incomingHhId } = req.body;// allow clients to pass an existing householdId to join, or omit to create a new one
  try {
    //check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    //Find or create the Household 
let household;
if (incomingHhId) {
  // join existing household
  household = await Household.findById(incomingHhId);
  if (!household) {
    return res.status(400).json({ message: "Invalid household ID" });
  }
} else {
  // create a new household for this user
  household = await Household.create({
    name: `${name}'s Household`,
    members: []
  });
}
    //create new user using housholdId
    const newUser = new User({
      name,
      email,
      password,
      householdId: household._id // set the householdId to the new or existing household
    });
    await newUser.save(); // password is hashed in user.js pre-save hook

    // Add the user to the household's members array
    household.members.push(newUser._id);
    await household.save();

    // Generate JWT token using the method defined in the user model
    const token = newUser.generateAuthToken();

    res.json({ accessToken: token });
  } catch (error) {
    console.error("Signup error", error);
    res.status(500).json({ message: "Signup Failed", error: error.message });
  }

 }

