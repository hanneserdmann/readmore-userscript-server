'use strict'

/**
 * UserFactory zum Verwalten von User-Objekten.
 * Es kann anhand der ID ein User ausgelesen oder (ohne ID) ein neuer User erstellt werden.
 * @constructor
 */
var UserFactory = function () {
    var self    = this,
        config  = require('config.json'),
        db      = require('lib/database');

    var readUserFromDatabase = function (userId, callback) {

        var sql = 'SELECT user.*, login.password, login.lastLogin, login.email FROM ' + config.database.table.user + ' AS user ' +
                  'JOIN ' + config.database.table.login + ' AS login ON user.id = login.user_id ' +
                  'WHERE user.id = ?';

        db.get(sql, [userId], function (err, row) {
            if (err === null && row !== undefined) {
                callback(row);
            } else {
                callback({id: 0});
            }
        });
    };

    var createUserInDatabase = function (email, password, callback) {
        var sql = 'INSERT INTO "' + config.database.table.user + '" ' +
                  '("registrationDate") ' +
                  'VALUES (?);';

        db.run(sql, [Date.now()], function (err) {
            var userId = this.lastID;

            if (err === null && userId) {
                sql = 'INSERT INTO "' + config.database.table.login + '" ' +
                      '("user_id", "email", "password", "lastLogin") ' +
                      'VALUES (?, ?, ?, ?);';

                db.run(sql, [userId, email, password, 0], function (err) {
                    if (err === null) {
                        self.getUser(userId, callback);
                    } else { callback({id: 0}); }
                });
            } else { callback({id: 0}); }
        });
    };

    var findUserIdentifiedByEmail = function (email, callback) {
        var sql = 'SELECT user_id as id FROM ' + config.database.table.login + ' ' +
                  'WHERE email LIKE ?';

        db.get(sql, [email], function (err, row) {
            if (err === null && row !== undefined) {
                self.getUser(row.id, callback);
            } else { callback({id: 0}); }
        });
    };

    /**
     * Liest einen User aus der Datenbank aus und ruft anschließend die Callback-Funktion auf,
     * die als Parameter das Userobject entgegennimmt.
     * @param userId
     * @param callback(user)
     *          success: user ist ein vollständiges User-Object
     *          error:   user ist {id: 0}
     */
    self.getUser = function (userId, callback) {
        readUserFromDatabase(userId, callback);
    };

    /**
     * Liest einen User anhand der Email-Adresse aus der Datenbank aus
     * @param email
     * @param callback(user)
     *          success: user ist ein vollständiges User-Object
     *          error:   user ist {id: 0}
     */
    self.findUser = function (email, callback) {
        findUserIdentifiedByEmail(email, callback);
    };

    /**
     * Erstellt einen neuen User in der Datenbank und liest diesen anschließent aus der Datenbank wieder aus,
     * der Callback-Funktion wird der User als Parameter übergeben.
     * @param email
     * @param password
     * @param callback(user)
     *          success: user ist ein vollständiges User-Object
     *          error:   user ist {id: 0}
     */
    self.createUser = function (email, password, callback) {
        createUserInDatabase(email, password, callback);
    };
};

module.exports = new UserFactory();