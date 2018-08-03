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
                    sql += `select idMovie, c00, c08, c20, premiered, rating from movie_view order by idMovie desc limit ${req.query[item]}`;
                } else {
                    sql += ` limit ${req.query[item]}`;
                }
            }

            if (item === 'offset') {
                if (sql === '') {
                    sql += `select idMovie, c00, c08, c20, premiered, rating from movie_view order by idMovie desc offset ${req.query[item]}`;
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
                    const parser = require('xml2json-light');

                    if (row.c08 != '') {
                        var poster = parser.xml2json(row.c08);
                        // console.log(poster);
                        var poster_temp = [];
                        
                        if(Array.isArray(poster.thumb)) {
                            poster.thumb.map((i) => {
                                if (i.aspect === 'poster') {
                                    poster_temp.push(i);
                                } else if (i.aspect === undefined) {
                                    poster_temp.push(i);
                                }
                                // console.log(poster_temp);
                            });
                        } else {
                            poster_temp.push(poster.thumb);
                        }

                        row.c08 = poster_temp[0].preview;
                    }

                    if (row.c20 != '') {
                        var fanart = parser.xml2json(row.c20);
                        // console.log(fanart);
                        var fanart_temp = [];

                        if (Array.isArray(fanart.fanart.thumb)) {
                            fanart.fanart.thumb.map((i) => {
                                if (i.aspect === 'fanart') {
                                    fanart_temp.push(i);
                                } else if (i.aspect === undefined) {
                                    fanart_temp.push(i);
                                }
                            });
                        } else {
                            fanart_temp.push(fanart.fanart.thumb);
                        }

                        // console.log(fanart_temp);
                        row.c20 = fanart_temp[0].preview;
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