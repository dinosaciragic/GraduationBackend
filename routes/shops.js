const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');
// Order model
const ShopItem = require('../models/ShopItem');

// api/shops?page=1
router.get('/', verify, (req, res) => {
    res.send("works");
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

module.exports = router;