'use strict'

// better paths
require('app-module-path').addPath(__dirname);

// includes
var express          = require('express'),
    path             = require('path'),
    bodyParser       = require('body-parser'),
    config           = require('config'),
    db               = require('lib/database'),
    session          = require('express-session'),
    app              = express();

// session store
var KnexSessionStore = require('connect-session-knex')(session),
    Knex             = require('knex'),
    sessionStore     = new KnexSessionStore({
        knex: new Knex({
            client: 'sqlite3',
            connection: {
                filename: config.database.path + config.database.name
            }
        }),
        tablename: config.database.table.session
    });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    store:  sessionStore,
    secret: config.session.secret,
    name:   config.session.name,
    resave: config.session.resave,
    saveUninitialized: config.session.saveUninitialized
}));

// routes
require('routes/default')(app, path);
require('routes/register')(app);
require('routes/login')(app);
require('routes/option')(app);


// start server
var server = app.listen(config.app.port, function () {

    var host = config.app.host,
        port = server.address().port;

    console.log(config.app.name + ' app listening at http://%s:%s', host, port);
});