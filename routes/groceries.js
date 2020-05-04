const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');
// Order model
const Grocerie = require('../models/Grocerie');

// api/groceries?page=1
router.get('/', verify, paginatedResults(Grocerie), (req, res) => {
    res.send(res.paginatedResults);
});

// api/groceries/add
router.post('/add', verify, (req, res) => {
    const { name, category, subCategory, price } = req.body;

    const newGrocerie = new Grocerie({
        name,
        category,
        subCategory,
        price
    });

    // Save Drug
    newGrocerie.save().then(grocerie => {
        res.send(grocerie);
    }).catch(err => console.error(err));

});

// Pagination middleware
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = req.query.page;
        const search = req.query.searchTerm;
        const category = req.query.category;
        const subCategory = req.query.subCategory;
        const limit = 12;
        var regex = new RegExp(search, 'i');  // RegEdp works as contains for find function and 'i' makes it case insensitive
        const startIndex = (page - 1) * limit;

        try {
            if (category) {
                if (subCategory) {
                    console.log('here')
                    const results = await model.find({ name: regex, category: category, subCategory: subCategory }).limit(limit).skip(startIndex).exec();
                    res.paginatedResults = results;
                    next();
                } else {
                    console.log('else')
                    const results = await model.find({ name: regex, category: category }).limit(limit).skip(startIndex).exec();
                    res.paginatedResults = results;
                    next();
                }

            } else {
                const results = await model.find({ name: regex }).limit(limit).skip(startIndex).exec();
                res.paginatedResults = results;
                next();
            }


        } catch (error) {
            res.status(500).json({ message: error.message });
        }


    }
}

module.exports = router;