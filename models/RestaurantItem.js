const mongoose = require('mongoose');

const RestaurantItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    restaurantName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number
    }
});

const RestaurantItem = mongoose.model('RestaurantItem', RestaurantItemSchema);

module.exports = RestaurantItem;