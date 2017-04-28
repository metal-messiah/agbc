var express = require('express');
var router = express.Router();
var app = require("../app")
//var getAbout = require('../apis/getAbout.js');


exports.getAbout = function (req, res) {
    console.log(req.app.locals.about);
    res.render('about', {title: 'AGBC', data: req.app.locals.about});
};

/* GET home page. */
router.get('/', exports.getAbout);

module.exports = router;
