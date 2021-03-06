const express = require('express');
const router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
    res.send(`
        <h1>Welcome to my Movies DB API service</h1>
        <p>
            Operated by query driven API.
        </p>
        <p>
            /movies?query=%%
            <ul>
                <li>id</li>
                <li>name</li>
				<li>limit</li>
                <li>offset</li>
                <li>total</li>
            </ul>
            <span>MIT, github.com/cpro95</span>
        </p>
    `);
});

module.exports = router;
