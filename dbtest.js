const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./MyVideos107.db', sqlite3.OPEN_READONLY, (err) => {
    if(err) {
        return console.error(err.message);
    }
    console.log('Connected to the MyVideos107.db');
});

// let sql = `select c00 from movie where c05 > 7.90`;
let sql = `select * from movie_view where idMovie = 93`;

db.all(sql, [], (err, rows) => {
    if(err) {
        throw err;
    }
    // console.dir(rows);
    var poster = [];
    rows.forEach( (row) => {
        console.log('===================================');
        // console.log(row.c08);
        var parser = require('xml2json-light');
        var json = parser.xml2json(row.c08);
        var arr = json.thumb;
        // console.log(arr);
        arr.map( (i) => {
            if(i.aspect === 'poster') {
               poster.push(i);  
            } else if(i.aspect === undefined) {
                poster.push(i);
            }
            // console.log(i);
        });
        // console.log(json.thumb[0]);
    });
    console.log(poster);
    console.log('===================================');
});

// close the database connection
db.close( (err) => {
    if(err) {
        return console.error(err.message);
    }
    console.log('Close the database connection');
});
