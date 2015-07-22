'use strict'

module.exports = function (app) {
    var validator    = require('validator'),
        config       = require('config'),
        errorFactory = require('lib/errorFactory'),
        userFactory  = require('lib/userFactory');

    app.route('/register/')
        .post(function (req, res) {
            if (validator.isEmail(req.body.email)) {
                // Email-Adresse ist okay

                if (validator.isLength(req.body.password, config.password.minLength, config.password.maxLength)) {
                    // Passwort hat die richtige Länge

                    userFactory.findUser(req.body.email, function (user) {
                        if (user.id === 0) {

                            // User existiert noch nicht
                            userFactory.createUser(req.body.email, req.body.password, function (user) {
                                if (user.id === 0) {
                                    res.json({"error": errorFactory.getError('userCreate')});
                                } else {
                                    req.session.user = user;
                                    res.json({"success": 'User wurde erfolgreich angelegt'});
                                }
                            });
                        } else { res.json({"error": errorFactory.getError('userExists')}); }
                    });
                } else { res.json({"error": errorFactory.getError('passwordLength')}); }
            } else { res.json({"error": errorFactory.getError('emailNotValid')}); }
        });
};