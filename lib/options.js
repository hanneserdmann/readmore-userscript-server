/**
 * Options
 */

var Options = function(db, dbExists){
    var that = this;

    that.get = function(req, res){

        db.get('SELECT * FROM options WHERE id = ?', [req.params.id], function(err, row) {
            // Userid noch nicht vorhanden
            if (row == null){
                row = {error: {
                    type: 'userid',
                    text: 'Es wurde kein Eintrag zu der Userid ' + req.params.id + ' gefunden.'
                }};
            }
            // Hash stimmt nicht überein
            else if (row.hash != req.params.hash){
                row = {error: {
                    type: 'hash',
                    text: 'Die Kombination aus ID und Hash stimmt nicht überein.'
                }};
            }

            res.json(row);
        });
    };

    that.post = function(req, res){

        if (_checkParams(req, res)){}
        else if (_checkBody(req, res)){}
        else{
            db.get('SELECT * FROM options WHERE id = ?', [req.params.id], function(err, row) {
                if (row != null){
                    res.json({error: {
                        type: 'userid',
                        text: 'Es wurde bereits ein Eintrag zu der Userid ' + req.params.id + ' gefunden.'
                    }});
                }
                else{
                    db.run('INSERT INTO options (id, hash, options, lastupdate) VALUES (?,?,?,?)',
                        [req.params.id, req.params.hash, req.body.options, req.body.lastupdate]);

                    res.json({success: {
                        type: 'create',
                        text: 'Es wurde ein Eintrag zu der Userid ' + req.params.id + ' erstellt.'
                    }});
                }
            });
        }
    };

    that.put = function(req, res){

        if (_checkParams(req, res)){}
        else if (_checkBody(req, res)){}
        else{
            db.get('SELECT * FROM options WHERE id = ?', [req.params.id], function(err, row) {
                // Userid noch nicht vorhanden
                if (row == null){
                    row = {error: {
                        type: 'userid',
                        text: 'Es wurde kein Eintrag zu der Userid ' + req.params.id + ' gefunden.'
                    }};
                }
                // Hash stimmt nicht überein
                else if (row.hash != req.params.hash){
                    row = {error: {
                        type: 'hash',
                        text: 'Die Kombination aus ID und Hash stimmt nicht überein.'
                    }};
                }
                else{
                    db.run('UPDATE options SET options = ?, lastupdate = ? WHERE id = ?',
                        [req.body.options, req.body.lastupdate, req.params.id]);

                    row = {success: {
                        type: 'edit',
                        text: 'Der Eintrag zu der Userid ' + req.params.id + ' wurde aktualisiert.'
                    }}
                }

                res.json(row);
            });
        }
    };

    var _checkParams = function(req, res){
        if (('' + req.params.id).length < 1 || ('' + req.params.hash).length < 1){
            res.json({error: {
                type: 'param',
                text: 'Es wurden nicht alle benötigten Parameter angegeben.'
            }});
            return true;
        }
        return false;
    };

    var _checkBody = function(req, res){
        if (!req.body.options || !req.body.lastupdate){
            res.json({error: {
                type: 'postdata',
                text: 'Es wurden nicht alle benötigten Daten übergeben.'
            }});
            return true;
        }
        return false;
    };

    // init the table if the database was just created
    (function(){
        if (!dbExists){
            db.serialize(function(){
                db.run( 'CREATE TABLE options (' +
                            'id INTEGER PRIMARY KEY UNIQUE,' +
                            'hash STRING,' +
                            'options TEXT,' +
                            'lastupdate INTEGER' +
                        ')');
            });
        }
    })();
};

module.exports = Options;