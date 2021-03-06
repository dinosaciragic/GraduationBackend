const express = require('express');
const app = express();
const mongoose = require('mongoose');
var bodyParser = require('body-parser');

const uri = "mongodb+srv://dinosaciragic:jebogadan@graduation-8ejos.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MangoDB Connected..'))
    .catch(err => console.log(err))

// Bodyparser
app.use(bodyParser.urlencoded({
    extended: true
}));

// NEW - Add CORS headers - see https://enable-cors.org/server_expressjs.html
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});


// Middleware
app.use(bodyParser.json());

// Route middlewares
app.use('/api/user', require('./routes/auth'));
app.use('/api/drugs', require('./routes/drugs'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/groceries', require('./routes/groceries'));
app.use('/api/shops', require('./routes/shops'));
app.use('/api/restaurants', require('./routes/restaurants'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));