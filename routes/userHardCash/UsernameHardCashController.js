var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var UsernameHardCash = require('./UsernameHardCash');
var config = require('../../config');

//Creates new card entry
router.post('/', VerifyToken, function (req, res) {
    //console.log(req.superuser);
    if (req.superuser === 'true') {
        UsernameHardCash.create({
            username: req.body.username,
            amount: parseFloat(req.body.amount)
        },
            function (err, cardb) {
                if (err) return res.status(500).send(err);
                res.status(200).send(cardb);
            });
    }
});

router.get('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        UsernameHardCash.find({}, function (err, cardbs) {
            if (err) return res.status(500).send("There was a problem finding the cards.");
            res.status(200).send(cardbs);
        });
    }
});

router.post('/updateAmount', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        UsernameHardCash.updateOne({ username: req.body.username }, { $set: { amount: parseFloat(req.body.amount) } }, function (err, cardbs) {
            if (err) return res.status(500).send("There was a problem updating the cards.");
            res.status(200).send(cardbs);
        });
    }
});

router.post('/deleteUsername', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        UsernameHardCash.findOneAndDelete({ username: req.body.username }, function (err, cardbs) {
            if (err) return res.status(500).send("There was a problem deleting the card.");
            res.status(200).send(cardbs);
        });
    }
});



module.exports = router;
