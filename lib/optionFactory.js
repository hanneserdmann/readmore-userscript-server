'use strict'

/**
 * OptionFactory zum Verwalten von Optionen.
 * Anhand der UserId können optionen bearbeitet,
 * angelegt oder zurückgegeben werden.
 * @constructor
 */
var OptionFactory = function () {
    var self    = this,
        config  = require('config.json'),
        db      = require('lib/database');

    var getOptionFromDatabase = function (userId, callback) {
        var sql = 'SELECT user_id AS id, option FROM ' + config.database.table.option + ' ' +
                  'WHERE user_id = ?';

        db.get(sql, [userId], function (err, row) {
            if (err === null && row !== undefined) {
                callback(row);
            } else { callback({id: 0}); }
        });
    };

    var editOptionInDatabase = function (userId, option, callback) {
        var sql = 'UPDATE ' + config.database.table.option + ' SET ' +
                  '"option" = ?, ' +
                  '"lastUpdate" = ? ' +
                  'WHERE "user_id" = ?';

        db.run(sql, [option, Date.now(), userId], function (err) {
            if (err === null) {
                self.getOption(userId, callback);
            } else { callback({id: 0}); }
        });
    };

    var createOptionInDatabase = function (userId, option, callback) {
        var sql = 'INSERT INTO ' + config.database.table.option + ' ' +
                  '("user_id", "option", "lastUpdate") ' +
                  'VALUES(?, ?, ?)';

        db.run(sql, [userId, option, Date.now()], function (err) {
            if (err === null) {
                self.getOption(userId, callback);
            } else { callback({id: 0}); }
        });
    };

    /**
     * Sucht die zur UserId gehörigen Optionen aus der Datenbank.
     * @param userId
     * @param callback(option)
     *          success: option ist ein vollständiges Option-Object
     *          error:   option ist {id: 0}
     */
    self.getOption = function (userId, callback) {
        getOptionFromDatabase(userId, callback);
    };

    /**
     * Updates die Optionen der zugehörigen UserId
     * @param userId
     * @param option
     * @param callback
     *          success: option ist ein vollständiges Option-Object
     *          error:   option ist {id: 0}
     */
    self.editOption = function (userId, option, callback) {
        editOptionInDatabase(userId, option, callback);
    };

    /**
     * Erstellt die zu einem User gehörigen Optionen
     * @param userId
     * @param option
     * @param callback
     *          success: option ist ein vollständiges Option-Object
     *          error:   option ist {id: 0}
     */
    self.createOption = function (userId, option, callback) {
        createOptionInDatabase(userId, option, callback);
    };
};

module.exports = new OptionFactory();