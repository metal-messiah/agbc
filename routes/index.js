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
        googleInfo.currentBook.getCells({
            'min-row': 2,
            'max-row': 2,
            'min-col': 1,
            'max-col': 3,
            'return-empty': true
        }, function (err, cells) {
            currentBook = {
                book: cells[0]._value,
                author: cells[1]._value,
                date: cells[2]._value
            };

            res.render('index', {title: 'AGBC', data: currentBook})
        });


    });
});


module.exports = router;
