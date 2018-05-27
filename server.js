const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// cors
app.use(cors());

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');

// un-comment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));
app.use(express.static(path.join(__dirname, 'public')));

// import routes
const index = require('./routes/index');
const movies = require('./routes/movies');

app.use('/api/v1', index);
app.use('/api/v1/movies', movies);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err)
});

app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    // res.render('error');
    res.send('Your URL : Not Found');
});

var port = normalizePort(process.env.PORT || '3030');
app.set('port', port);

// create htpp server
const server = http.createServer(app);

// listen
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

//
// Normalize a port into a number, string, or false
//

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

//
// Event listener for HTTP server "error" event
//

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch(error.code) {
        case 'EACCESS' :
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE' :
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

//
// Event listener for HTTP server "listening" event.
//

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}