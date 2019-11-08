var express = require('express');
var router = express.Router();
let User = require('../model/Users');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.userId) {
        User.findOne(req.session.userId).then((user) => {
            if (user && user.endereco) {
                res.render('feed', {user});
            } else if (user) {
                res.redirect('/endereco');
            } else {
                res.redirect('/login');
            }
        })
    } else {
        res.redirect('/');
    }
});

module.exports = router;
