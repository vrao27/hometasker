const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        required: true
    },
 //   completedBy: {
 //       type: String,
 //       default: null }

    // Schema to capture who is working on the task
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // Current status of the task - available, in progress or completed
    status: {
        type: String,
        enum: ['available', 'inProgress', 'completed'],
        default: 'available'
    },

    // Updated completedBy field 
});

//schema is assigned to the Task variable
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;