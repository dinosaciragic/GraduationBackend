const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');
// Order model
const Order = require('../models/Order');

// api/orders/add
router.post('/add', verify, (req, res) => {
    const { items, location, userId, deliveryTime, contctPhone, itemsCost, totalCost, isStarted } = req.body;

    const newOrder = new Order({
        items,
        location,
        userId,
        deliveryTime,
        contctPhone,
        itemsCost,
        totalCost,
        isStarted
    });

    // Save order
    newOrder.save().then(order => {
        res.send(order);
    }).catch(err => console.error(err));

});

router.post('/userOrders', verify, async (req, res) => {
    try {
        const results = await Order.find({ userId: req.body.userId });
        res.send(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;