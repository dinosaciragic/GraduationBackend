const express = require('express');
const router = express.Router();
const verify = require('./verifytoken');
// Drug model
const Drug = require('../models/Drug');

// api/drugs?page=1
router.get('/', verify, paginatedResults(Drug), (req, res) => {
    res.send(res.paginatedResults);
});

// api/drugs/add
router.post('/add', verify, (req, res) => {
    const { name, price } = req.body;

    const newDrug = new Drug({
        name,
        price
    });

    // Save Drug
    newDrug.save().then(drug => {
        res.send(drug);
    }).catch(err => console.error(err));

});

// Pagination middleware
function paginatedResults(model) {
    return async (req, res, next) => {
        const page = req.query.page;
        const limit = 10;

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        try {
            const results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginatedResults = results;
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }


    }
}

module.exports = router;