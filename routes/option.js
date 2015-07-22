'use strict'

module.exports = function (app) {

    var errorFactory  = require('lib/errorFactory'),
        optionFactory = require('lib/optionFactory');

    var checkLogin = function (req, res) {
        if (req.session.user === undefined || req.session.user.id === 0) {
            res.json({"error": errorFactory.getError('userNoOption')});
            return false;
        }

        return true;
    };

    app.route('/option/')

        // Als eingeloggter User die Optionen zurück
        // geliefert bekommen
        .get(function (req, res) {

            if (checkLogin(req, res)) {
                optionFactory.getOption(req.session.user.id, function (option) {
                    if (option.id === 0) {
                        res.json({"error": errorFactory.getError('userNoOption')});
                    } else {
                        res.json({ "success": { "option": option }});
                    }
                });
            }
        })

        // Als eingeloggter User die Optionen
        // zum ersten mal setzen
        .post(function (req, res) {

            if (checkLogin(req, res)) {
                optionFactory.getOption(req.session.user.id, function (option) {
                    if (option.id === 0) {
                        optionFactory.createOption(req.session.user.id, req.body.option, function (option) {
                            if (option.id !== 0) {
                                res.json({"success": option});
                            } else {
                                res.json({"error": errorFactory.getError('userOptionCreate')});
                            }
                        });
                    } else { res.json({"error": errorFactory.getError('userOptionExists')}); }
                });
            }
        })

        // Als eingeloggter User die bereits bestehenden Optionen
        // bearbeiten
        .put(function (req, res) {
            if (checkLogin(req, res)) {
                optionFactory.getOption(req.session.user.id, function (option) {
                    if (option.id !== 0) {
                        optionFactory.editOption(option.id, req.body.option, function (option) {
                            if (option.id !== 0) {
                                res.json({"success": option});
                            } else {
                                res.json({"error": errorFactory.getError('userOptionEdit')});
                            }
                        });
                    } else { res.json({"error": errorFactory.getError('userNoOption')}); }
                });
            }
        });
};