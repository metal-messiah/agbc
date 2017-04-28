var express = require('express');
var router = express.Router();
var getAbout = require('../apis/getAbout.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('about', {title: 'AGBC', about: about});
});

module.exports = router;
