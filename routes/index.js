var express = require('express');
var router = express.Router();
var cb = require('../apis/getCurrentBook.js')



/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'AGBC', data: currentBook});
});

module.exports = router;
