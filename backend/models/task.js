const mongoose = require('mongoose');



const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
    completedBy: {
        type: String,
        default: null
    }
});