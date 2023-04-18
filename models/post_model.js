const mongoose = require('mongoose');


const modelSchema = new mongoose.Schema(
{
        body: String, 
        permalink: String,
        author: String,
        title: String,
        tags: Array,
        comment: Array,
        date: Date,
    }
);

module.exports = mongoose.model('posts', modelSchema);