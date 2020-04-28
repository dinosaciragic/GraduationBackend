const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');
// Order model
const Order = require('../models/Order');

// api/orders/add
router.post('/add', verify, (req, res) => {
    const { items, location, userId, deliveryTime, contactPhone, itemsCost, totalCost, isStarted, notes } = req.body;

    const newOrder = new Order({
        items,
        location,
        userId,
        deliveryTime,
        contactPhone,
        itemsCost,
        totalCost,
        isStarted,
        notes
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

router.post('/workerOrders', verify, paginatedResults(Order), (req, res) => {
    res.send(res.paginatedResults);
});

router.put('/:id', verify, (req, res, next) => {
    Order.findByIdAndUpdate({ _id: req.params.id }, req.body).then((updatedOrder) => {
        res.send(updatedOrder);
    });
});

// Pagination middleware
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = req.query.page;
        const limit = 12;

        const startIndex = (page - 1) * limit;

        try {
            const results = await model.find({ isStarted: false }).limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }


    }
}

module.exports = router;