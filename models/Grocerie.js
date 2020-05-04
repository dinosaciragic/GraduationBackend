const mongoose = require('mongoose');

const GrocerieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subCategory: {
        type: String
    },
    price: {
        type: Number,
        required: true
    }
});

const Grocerie = mongoose.model('Grocerie', GrocerieSchema);

module.exports = Grocerie;