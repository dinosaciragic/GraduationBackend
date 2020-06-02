const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');
// Order model
const RestaurantItem = require('../models/RestaurantItem');

// api/restaurants?page=1
router.get('/', verify, paginatedResults(RestaurantItem), (req, res) => {
    res.send(res.paginatedResults);
});


// api/restaurants/add
router.post('/add', verify, (req, res) => {
    const { name, restaurantName, price } = req.body;

    const newRestaurantItem = new RestaurantItem({
        name,
        restaurantName,
        price
    });

    // Save Restaurant item
    newRestaurantItem.save().then(RestaurantItem => {
        res.send(RestaurantItem);
    }).catch(err => console.error(err));

});

// Pagination middleware
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = req.query.page;
        const search = req.query.searchTerm;
        const restaurantName = req.query.restaurantName;
        const limit = 12;
        var regex = new RegExp(search, 'i');  // RegEdp works as contains for find function and 'i' makes it case insensitive
        const startIndex = (page - 1) * limit;

        try {

            const results = await model.find({ name: regex, restaurantName: restaurantName }).limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();

        } catch (error) {
            res.status(500).json({ message: error.message });
        }


    }
}

module.exports = router;