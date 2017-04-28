var express = require('express');
var router = express.Router();
var users = require('../apis/getUsers.js');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('members', {title: 'AGBC', data: userData});
});

router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    res.render('member', {title: userData[id].name, data: userData[id]});
});

module.exports = router;
