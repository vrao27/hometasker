//allows app to communicate with MongoDB
//connects to MongoDB database using mongoose
//uses dotenv to load environment variables from a .env file into process.env
//.env file contains the MongoDB URI
const mongoose = require('mongoose');
require('dotenv').config();



// MongoDB connection function
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err);
        process.exit(1);
    }
};

module.exports = connectDB;

