const mongoose = require('mongoose');

const ShopItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    shopType: {
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

const ShopItem = mongoose.model('ShopItem', ShopItemSchema);

module.exports = ShopItem;