const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    _id: String,
    student_id: Object,
    scores: Array,
    class_id: String,
});

module.exports = mongoose.model('grades', modelSchema);


