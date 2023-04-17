const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
    _id : String,
    name: String,
    phoneNumber: Number,
    city: String, 
    country: String, 
    address : String
});

module.exports = mongoose.model('usrlists', modelSchema);


