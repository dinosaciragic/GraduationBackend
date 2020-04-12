const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    items: {
        type: Array,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    deliveryTime: {
        type: String,
        required: true
    },
    contctPhone: {
        type: Number,
        required: true
    },
    itemsCost: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    isStarted: {
        type: Boolean,
        required: true
    },
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;