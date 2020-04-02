const mongoose = require('mongoose');

const DrugSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const Drug = mongoose.model('Drug', DrugSchema);

module.exports = Drug;