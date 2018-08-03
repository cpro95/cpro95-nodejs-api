const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

var db;
var db_file = './MyVideos107.db';
// var openingDate = '2017-07-01';
// var sql = `select * from movie where premiered >= '${openingDate}'`;

var sql;

// open the database connection
const db_open = () => {
    //open the database
    db = new sqlite3.Database(db_file, sqlite3.OPEN_READONLY, (err) => {
        if (err) {
            return console.error(err.message);
        } else {
            console.log('Connected to the ' + db_file);
        }
    });
}

// close the database connection
const db_close = () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        } else {
            console.log('Close the database connection');
        }
    });
}

// a middleware
router.use((req, res, next) => {
    console.log('Time:' + Date());
    next();
})

router.get('/', (req, res, next) => {

    // query
    // id, name, limit, offset
    var isTotal = false;

    if (Object.keys(req.query).length === 0) {
        // no query
        sql = `select idMovie, c00, c08, c20 from movie order by idMovie desc limit 10 offset 0`;
    } else {
        // parse search query to db sql
        const query = Object.keys(req.query);
        // sql = `select * from movie where c00 like '%${req.query.name}%'`;

        sql = '';


        query.map((item) => {
            if (item === 'name') {
                sql += `select idMovie, c00, c08, c20 from movie where c00 like '%${req.query[item]}%' order by idMovie desc`;
            }

            if (item === 'id') {
                sql += `select * from movie_view where idMovie = ${req.query[item]}`;
            }

            if (item === 'limit') {
                if (sql === '') {
                    sql += `select idMovie, c00, c08, c20 from movie order by idMovie desc limit ${req.query[item]}`;
                } else {
                    sql += ` limit ${req.query[item]}`;
                }
            }

            if (item === 'offset') {
                if (sql === '') {
                    sql += `select idMovie, c00, c08, c20 from movie order by idMovie desc offset ${req.query[item]}`;
                } else {
                    sql += ` offset ${req.query[item]}`;
                }
            }

            if (item === 'total') {
                sql = `select count(idMovie) as total from movie`;
                isTotal = true;
            }

        }); // end of query.map
        console.log(sql);
    } // end of checking query

    db_open();
    if (isTotal) {
        db.all(sql, [], (err, movies) => {
            if (err) {
                //throw err;
                res.send('DB SQL query error: Please request correct sql query');
                next(err);
            } else {
                res.send(movies[0]);
            }
        });
    } else {
        db.all(sql, [], (err, movies) => {
            if (err) {
                //throw err;
                res.send('DB SQL query error: Please request correct sql query');
                next(err);
            } else {
                // movies.c08, c20 is the type of xml
                // movies is array
                movies.forEach((row) => {
                    const parser = new require('xml2js').Parser();

                    if (row.c08 != '') {
                        parser.parseString(row.c08, (err, result) => {
                            // replacing preview link to movies.c08
                            row.c08 = result.thumb.$.preview;
                        });
                    }

                    if (row.c20 != '') {
                        parser.parseString(row.c20, (err, result) => {
                            // replacing preview link to movies.c20
                            row.c20 = result.fanart.thumb[0].$.preview;
                        });
                    }
                });

                if (Object.keys(movies).length === 0) {
                    res.send('No data found');
                } else {
                    res.send(movies);
                }
            }
        });
    }
    db_close();


})

module.exports = router;