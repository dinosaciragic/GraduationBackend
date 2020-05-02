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

// get user orders
router.post('/userOrders', verify, async (req, res) => {
    try {
        const results = await Order.find({ userId: req.body.userId });
        res.send(results);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get worker orders for home page/dashboard paged
router.post('/workerOrders/:page', verify, paginatedResults(Order), (req, res) => {
    res.send(res.paginatedResults);
});

// get worker orders by id for worker
router.get('/workerOrders/:id', verify, getWorkerOrders(), (req, res) => {
    res.send(res.workerOrders);
});

// Get order by id
router.get('/single/:id', verify, (req, res) => {
    Order.findOne({ _id: req.params.id }).then(order => {
        res.send(order)
    });
});

// edit order
router.put('/edit/:id', verify, async (req, res, next) => {
    const alreadyTaken = await Order.find({ workerId: req.body.workerId });
  
    if (alreadyTaken.length < 2) {
        Order.findByIdAndUpdate({ _id: req.params.id }, req.body).then((updatedOrder) => {
            res.send({ updatedOrder: true });
        });
    } else {
        res.send({ msg: "You can have a max of two taken orders at a time" });
    }
});
 
// Delete order API
router.delete('/delete/:id', verify, (req, res, next) => {
    Order.findByIdAndDelete({ _id: req.params.id }).then((updatedOrder) => {
        res.send({ deletedOrder: true });
    });
});

// Pagination middleware
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = req.params.page;
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

function getWorkerOrders() {
    return async (req, res, next) => {
        try {
            const results = await Order.find({ workerId: req.params.id });
            res.workerOrders = results;
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = router;