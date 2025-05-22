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

    // Schema to capture who is working on the task once a task has been claimed (ensures that only one user can work on a task at a time)
    //use Objectid to link to the user model i.e. the id of a user
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    
    // Current status of the task - available, in progress or completed
    
    status: {
        type: String,
        enum: ['available', 'inProgress', 'completed'],
        default: 'available'
    },



    // Updated completedBy field 
    completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    // Date/Time when the task was completed
    completedAt: {
        type: Date,
        default: null
    },


});

//schema is assigned to the Task variable
//use indexing here to speed up the search for 'status' and 'assignedTo' fields
// check status in ascending oreder i.e. "status: 1" use "-1" for descending order
taskSchema.index({ status: 1, assignedTo: 1 });


// Create the Task model using the taskSchema ans export 
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;