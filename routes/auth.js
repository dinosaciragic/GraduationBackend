const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const constants = require('../shared/constants');

// User model
const User = require('../models/User');
// api/user/register
router.post('/register', (req, res) => {
    const { email, password, location, isClient } = req.body;
    let errors = [];

    // Check required fields
    if (!email || !password || !location) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters long' });
    }

    if (errors.length > 0) {
        res.send(errors);
    } else {
        // Validation passed
        User.findOne({ email: email }).then(user => {
            if (user) {
                errors.push({ msg: 'There is already a User with that e-mail' });
                res.send(errors);
            } else {
                const newUser = new User({
                    email,
                    password,
                    location,
                    isClient
                });

                // Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    // Set password to hashed
                    newUser.password = hash;
                    // Save user
                    newUser.save()
                        .then(user => {
                            res.send(user);
                        })
                        .catch(err => console.error(err));
                }))
            }
        });
    }

});

router.post('/login', async (req, res) => {
    let errors = [];
    // Add validation DS 08.02.2020.

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        errors.push({ msg: 'Email or password is incorrect' }); // Add email or password is incorrect once tested DS 08.02.2020.
        res.send(errors);
    }
    // Check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) {
        errors.push({ msg: 'Email or password is incorrect' }); // Add email or password is incorrect once tested DS 08.02.2020.
        res.send(errors);
    }

    // Create and assign a token
    const token = jwt.sign({ _id: user._id, isClient: user.isClient }, constants.TOKEN_SECRET);
    res.header('Authorization', token).send({ token: token });
});

module.exports = router;