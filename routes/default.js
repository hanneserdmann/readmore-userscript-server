module.exports = function (app, path){
    app.get('/', function(req, res){
        res.redirect('/api');
    });

    app.get('/api', function (req, res) {
        res.sendFile(path.join(__dirname, '../', 'api.html'));
    });
};