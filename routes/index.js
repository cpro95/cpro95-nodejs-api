const express = require('express');
const router = express.Router();
const path = require('path');

// GET home page
router.get('/', function(req, res, next) {
    res.send(`
        <h1>Welcome to my Movies DB API service</h1>
        <p>
            It's query driven API.
        </p>
        <p>
            /movies?query=%%
            <ul>
                <li>id</li>
                <li>name</li>
                <li>rating</li>
            </ul>
            <span>MIT, github.com/cpro95</span>
        </p>
    `);
});

module.exports = router;