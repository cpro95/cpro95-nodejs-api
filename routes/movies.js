const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

var db;
var sql = `select * from movie where c05 > 8.00`;

// open the database connection
const db_open = () => {
    //open the database
    db = new sqlite3.Database('./MyVideos107.db', sqlite3.OPEN_READONLY,(err) => {
        if(err) {
            return console.error(err.message);
        } else {
            console.log('Connected to the MyVideos107.db');
        }
    });
}

// close the database connection
const db_close = () => {
    db.close( (err) => {
        if(err) {
            return console.error(err.message);
        } else {
            console.log('Close the database connection');
        }
    });
}

// a middleware
router.use( (req, res, next) => {
    console.log('Time:' +  Date());
    next();
})

router.get('/', (req,res,next) => {
    if(Object.keys(req.query).length === 0) {
        // no query
    } else {
        // parse search query to db sql
        const query = Object.keys(req.query);
        // sql = `select * from movie where c00 like '%${req.query.name}%'`;

        sql = `select * from movie where`;
        query.map( (item) => {
            if(item === 'name') {
                if(sql.slice(-5) != 'where') sql += ` and `;
                sql += ` c00 like '%${req.query[item]}%'`;
            }

            if(item === 'rating') {
                if(sql.slice(-5) != 'where') sql += ` and `;
                sql += ` c05 >= ${req.query[item]}`;
            }

            if(item === 'id') {
                if(sql.slice(-5) != 'where') sql += ` and `;
                sql += ` idMovie = ${req.query[item]}`;
            }
        });
        console.log(sql);
    }

    // sql is prepared, then let's open db
    db_open();

    db.all(sql, [], (err, movies) => {
        if(err) {
            throw err;
        } else {
            // movies.c08, c20 is the type of xml
            // movies is array
            movies.forEach( (row) => {
                const parser = new require('xml2js').Parser();

                if(row.c08 != '') {
                    parser.parseString(row.c08, (err, result) => {
                        // replacing preview link to movies.c08
                        row.c08 = result.thumb.$.preview;
                    });
                }

                if(row.c20 != '') {
                    parser.parseString(row.c20, (err, result) => {
                        // replacing preview link to movies.c20
                        row.c20 = result.fanart.thumb[0].$.preview;
                    });
                }
            });

            if(Object.keys(movies).length === 0) {
                res.send('No data found');
            } else {
                res.send(movies);
                // res.json(movies);
            }
        }
    });

    db_close();
})

module.exports = router;