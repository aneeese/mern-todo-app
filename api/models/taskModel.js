const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    task: {
        type: String,
        requierd: [true, "Please add a task"]
    },
    completed: {
        type: Boolean
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Task', itemSchema);