'use strict'

/**
 * Wrapper für sqlite3, falls die Datenbank noch nicht
 * existiert wird sie vorher angelegt.
 * @constructor
 */
var Database = function () {
    var self        = this,
        config      = require('config.json'),
        fs          = require("fs"),
        sqlite3     = require('sqlite3').verbose(),
        dbFile      = config.database.path + config.database.name,
        dbExists    = fs.existsSync(dbFile),
        db          = new sqlite3.Database(dbFile);

    self.get = function (sql, param, callback) {
        db.get(sql, param, callback);
    };

    self.run = function (sql, param, callback) {
        db.run(sql, param, callback);
    };

    var createDatabase = function () {
        if (!dbExists) {
            var packageJSON = require('package');

            db.serialize(function () {
                self.run('CREATE TABLE "' + config.database.table.user + '" (' +
                            '"id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,' +
                            '"registrationDate" numeric NOT NULL' +
                         ');');

                self.run('CREATE TABLE "' + config.database.table.login + '" (' +
                            '"user_id" integer NOT NULL UNIQUE,' +
                            '"email" text NOT NULL UNIQUE,' +
                            '"password" text NOT NULL,' +
                            '"lastLogin" integer NOT NULL,' +
                            'FOREIGN KEY ("user_id") REFERENCES "user" ("id")' +
                         ');');

                self.run('CREATE TABLE "' + config.database.table.option + '" (' +
                            '"user_id" integer NOT NULL UNIQUE,' +
                            '"option" text NOT NULL,' +
                            '"lastUpdate" integer NOT NULL,' +
                            'FOREIGN KEY ("user_id") REFERENCES "user" ("id")' +
                         ');');

                self.run('CREATE TABLE "' + config.database.table.version + '" (' +
                            '"version" text NOT NULL' +
                        ');');

                // Um später Updates an der Datenbankstruktur durchführen zu können
                self.run('INSERT INTO "' + config.database.table.version + '" ("version") VALUES (?);', [packageJSON.version]);
            });
        }
    };

    var construct = function () {
        if (!dbExists) {
            createDatabase();
        }
    };

    construct();
};

module.exports = new Database();