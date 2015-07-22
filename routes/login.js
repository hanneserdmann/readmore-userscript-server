'use strict'

module.exports = function (app) {
    var errorFactory = require('lib/errorFactory'),
        userFactory  = require('lib/userFactory');

    app.route('/login/')
        .post(function (req, res) {
            userFactory.findUser(req.body.email, function (user) {
                if (user.id !== 0 && user.password === req.body.password) {
                    req.session.user = user;
                    res.json({"success": 'Login erfolgreich abgeschlossen'});
                } else { res.json({"error": errorFactory.getError('userLogin')}); }
            });
        });
};