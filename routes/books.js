var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next) {

    var goodreads = require('goodreads');

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
        googleInfo.website.getRows({
            offset: 1,
            limit: 100
        }, function (err, rows) {
            bookData = [];

            for (var i = 0; i < rows.length; i++) {


                var row = rows[i];
                //console.log(row.book);

                if (row.id && row.book) {

                    if (row.average == "#DIV/0!") {
                        row.average = 0
                    }
                    if (row.median == "#DIV/0!") {
                        row.median = 0
                    }
                    //console.log(row)
                    var obj = {
                        id: row.id,
                        book: row.book,
                        type: row.type,
                        author: row.author,
                        date: row.meeting,
                        chosen: row.chosen,
                        average: row.average,
                        median: row.median,
                        grID: null,
                        thumbnail: '/images/no_cover.jpg',
                        grURL: "#"
                    };
                    //console.log(obj);

                    bookData.push(obj);


                    var goodreadsKey = "GJhHhKXZ5QdcczBAwkBo1A";
                    var goodreadsSecret = "McGNCMy5fy4yaksvI4tyrAIMUHDswpSaTwvowz3XRQ";
                    var gr = new goodreads.client({'key': goodreadsKey, 'secret': goodreadsSecret});

                    var goodreadsInfo = gr.getReviewsByTitle(row.book, row.author, (row.id - 1), function (json) {
                        var grBook, inputID;
                        try {
                            grBook = json.GoodreadsResponse.book[0];
                            inputID = json.inputID
                        }
                        catch (err) {
                            grBook = {id: null, image_url: '/images/no_cover.jpg', url: '#'};
                            inputID = null
                        }
                        //console.log(json)
                        //console.log(json)
                        if (inputID) {

                            bookData[inputID].grID = grBook.id;
                            bookData[inputID].thumbnail = grBook.image_url[0];
                            bookData[inputID].grURL = grBook.url[0];
                            //console.log(bookData[inputID])
                        }
                    });
                }
            }
            setTimeout(function () {
                res.render('books', {title: 'AGBC', data: bookData})
            }, 2000)

        });
    });
});


module.exports = router;


