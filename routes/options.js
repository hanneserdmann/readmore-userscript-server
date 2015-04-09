module.exports = function (app, path, db, dbExists){

    app.route('/api/options/:id/:hash')
        // receive
        .get(function(req, res){
            var Options = require('../lib/options.js'),
                options = new Options(db, dbExists);

            options.get(req, res);
        })

        // create
        .post(function(req, res){
            var Options = require('../lib/options.js'),
                options = new Options(db, dbExists);

            options.post(req, res);
        })

        // edit
        .put(function(req, res){
            var Options = require('../lib/options.js'),
                options = new Options(db, dbExists);

            options.put(req, res);
        });

};