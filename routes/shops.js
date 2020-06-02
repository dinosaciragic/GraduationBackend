const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');
// Order model
const ShopItem = require('../models/ShopItem');

// api/shops?page=1
router.get('/', verify, paginatedResults(ShopItem), (req, res) => {
    res.send(res.paginatedResults);
});


// api/shops/add
router.post('/add', verify, (req, res) => {
    const { name, shopType, price } = req.body;

    const newShopItem = new ShopItem({
        name,
        shopType,
        price
    });

    // Save Drug
    newShopItem.save().then(ShopItem => {
        res.send(ShopItem);
    }).catch(err => console.error(err));

});

// Pagination middleware
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = req.query.page;
        const search = req.query.searchTerm;
        const shopType = req.query.shopType;
        const limit = 12;
        var regex = new RegExp(search, 'i');  // RegEdp works as contains for find function and 'i' makes it case insensitive
        const startIndex = (page - 1) * limit;

        try {

            const results = await model.find({ name: regex, shopType: shopType }).limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();

        } catch (error) {
            res.status(500).json({ message: error.message });
        }


    }
}

module.exports = router;