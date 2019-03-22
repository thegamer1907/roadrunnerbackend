var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var IsFoodAdmin = require('./IsFoodAdmin');
var config = require('../../config');

router.put('/add/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsFoodAdmin.updateOne({ username: req.params.username }, { $set: { isFoodAdmin: true } }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send({ message: "user set as finance admin" });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.put('/remove/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsFoodAdmin.updateOne({ username: req.params.username }, { $set: { IsFoodAdmin: false } }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send({ message: "user removed as superuser" });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});


router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsFoodAdmin.create({
            username: req.body.username,
            isFoodAdmin: true
        },
            function (err, item) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send({ message: "added" });
            });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

module.exports = router;
