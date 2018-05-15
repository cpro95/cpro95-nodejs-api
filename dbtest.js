const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./MyVideos107.db', sqlite3.OPEN_READONLY, (err) => {
    if(err) {
        return console.error(err.message);
    }
    console.log('Connected to the MyVideos107.db');
});

// let sql = `select c00 from movie where c05 > 7.90`;
let sql = `select * from movie where c05 > 7.90`;

db.all(sql, [], (err, rows) => {
    if(err) {
        throw err;
    }
    // console.dir(rows);
    rows.forEach( (row) => {
        console.log('===================================');
        console.log(row.c00);
    });
    console.log('===================================');
});

// close the database connection
db.close( (err) => {
    if(err) {
        return console.error(err.message);
    }
    console.log('Close the database connection');
});
