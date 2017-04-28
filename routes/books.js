var express = require('express');
var router = express.Router();

var apiData = require('../apis/googleSheets.js');



console.log(apiData);

router.get('/', function (req, res, next) {
    res.render('books', {title: 'AGBC', data: bookData});
});
/* GET home page. */


module.exports = router;


