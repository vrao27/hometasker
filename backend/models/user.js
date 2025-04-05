const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



// Define the User schema
const userSchema = new mongoose.Schema({
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
  });

module.exports = mongoose.model('User', userSchema);


// Hash password before saving to the database, this is a middleware function anbd should never be saved in plain text

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) 
    
    return next();
  
    const salt = await bcrypt.genSalt(10);
    // Hash the password using bcrypt
    // this.password is the password field in the schema
    this.password = await bcrypt.hash(this.password, salt);

    next();

  });
  