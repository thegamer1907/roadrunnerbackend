var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var IsAdmin = require('./isAdmin');
var config = require('../../config');


router.put('/add/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsAdmin.updateOne({ username: req.params.username }, { $set: { isSuperuser: true } }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send({ message: "user set as admin" });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.put('/remove/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsAdmin.updateOne({ username: req.params.username }, { $set: { isAdmin: false } }, function (err, user) {
            if (err) return res.status(500).send("There was a problem updating the user.");
            res.status(200).send({ message: "user removed as admin" });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsAdmin.create({
            username: req.body.username,
            isAdmin: true
        },
            function (err, item) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send({ message: "added" });
            });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});


router.delete('/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsAdmin.findOneAndDelete({ username: req.params.username }, function (err, items) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!items) return res.status(404).send("No items found.");
            res.status(200).send({ message: "deleted" });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

module.exports = router;