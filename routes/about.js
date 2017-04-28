var express = require('express');
var router = express.Router();
//var getAbout = require('../apis/getAbout.js');


exports.getAbout = function (req, res) {
    console.log(req.app.locals.about);
    res.send(200);
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('about', {title: 'AGBC', data: req.app.locals.about});
});

module.exports = router;
