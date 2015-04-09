// includes
var express     = require('express'),
    app         = express(),
    path        = require('path'),
    fs          = require("fs"),
    bodyParser  = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// database connection
var sqlite3  = require('sqlite3').verbose(),
    dbFile   = 'userscript.db',
    dbExists = fs.existsSync(dbFile),
    db       = new sqlite3.Database(dbFile);

// routes
require('./routes/default.js')(app, path);
require('./routes/options.js')(app, path, db, dbExists);

// start server
var server = app.listen(3001, function () {

    var host = '127.0.0.1';
    var port = server.address().port;

    console.log('readmore-userscript-server app listening at http://%s:%s', host, port);

});