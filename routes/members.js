var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {

    var GoogleSpreadsheet = require('google-spreadsheet');
    var doc = new GoogleSpreadsheet('1d8rZFUSAOY34W6bgKlQAp4oswU-D3u1Z8gsdOcmMzLY');
    doc.getInfo(function (err, info) {
        console.log('Loaded doc: ' + info.title + ' by ' + info.author.email);

        var googleInfo = {
            currentBook: info.worksheets[3],
            members: info.worksheets[4],
            about: info.worksheets[5],
            website: info.worksheets[6]
        };
        googleInfo.members.getRows({
            offset: 1,
            limit: 20
        }, function (err, rows) {
            userData = [];

            for (var i = 0; i < rows.length; i++) {

                var row = rows[i];

                if (row.name) {

                    //console.log(row.name);
                    var obj = {
                        name: row.name,
                        summary: row.summary || "Cobaltums sunt decors de altus competition.",
                        description: row.fulldescription || "Luras tolerare! Uria de primus burgus, demitto mens!",
                        headshot: row.headshoturl,
                        join: row.joindate || "Joined a long time ago",
                        average: row.averageranking || Math.random(),
                        badges: row.badges,
                        goodreads: row.goodreadspage,
                        favorite: row.favoriteagbcbook,
                        reviewsCount: row.reviews,
                        id: i
                    };
                    userData.push(obj);
                }
            }

            res.render('members', {title: 'AGBC', data: userData});
        });


    });
});

router.get('/:id', function (req, res, next) {

    var id = req.params.id;
    res.render('member', {title: userData[id].name, data: userData[id]});

});


module.exports = router;
