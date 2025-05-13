const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Define the User schema
const userSchema = new mongoose.Schema({

  //basic user profile and autherntication fields
  // name, email and password
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Make sure no duplicate emails
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8, // Basic security
  },
    
    
    //game related fields - points and badges based on the tasks completed
    points: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
  });

// Hash password before saving to the database, this is a middleware function anbd should never be saved in plain text

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) 
    
    return next(); //move on if the password is not modified
  
    const salt = await bcrypt.genSalt(10);
    // Hash the password using bcrypt
    // this.password is the password field in the schema
    this.password = await bcrypt.hash(this.password, salt);

    next();//move to saving the iser
});
  

// Instance Method to compare password input with hashed password
userSchema.methods.comparePassword = async function (inputPassword) {
  //comnpare the input password with the hashed password
  // this.password is the hashed password in the database
  // inputPassword is the password entered by the user
  return await bcrypt.compare(inputPassword, this.password);
}

  //Instance method to generate JWT token for the user
  userSchema.methods.generateAuthToken = function () {
    //token payload build
    const payload = {
      userId: this._id,
      email: this.email,
      name: this.name,
    };

    //sign and retuen the token
    return jwt.sign(
      payload,
    process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    )
  };

// Create and Export the model
const User = mongoose.model('User', userSchema);
module.exports = User;