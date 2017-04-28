var express = require('express');
var router = express.Router();
var cb = require('../apis/getCurrentBook.js');
//console.log(currentBook)
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('currentBook', {title: 'AGBC', data: currentBook});
});

module.exports = router;
