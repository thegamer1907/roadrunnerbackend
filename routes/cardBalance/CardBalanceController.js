var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var CardBalance = require('./CardBalance');
var config = require('../../config');

//Creates new card entry
router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        CardBalance.create({
            cardNo: req.body.cardNo,
            balance: parseFloat(req.body.balance)
        },
            function (err, cardb) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(cardb);
            });
    }
});

router.get('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        CardBalance.find({}, function (err, cardbs) {
            if (err) return res.status(500).send("There was a problem finding the cards.");
            res.status(200).send(cardbs);
        });
    }
});

router.post('/updateBalance', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        CardBalance.updateOne({ cardNo: req.body.cardNo }, { $set: { balance: parseFloat(req.body.balance) } }, function (err, cardbs) {
            if (err) return res.status(500).send("There was a problem updating the cards.");
            res.status(200).send(cardbs);
        });
    }
});

router.post('/deleteCard', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        CardBalance.findOneAndDelete({ cardNo: req.body.cardNo }, function (err, cardbs) {
            if (err) return res.status(500).send("There was a problem deleting the card.");
            res.status(200).send(cardbs);
        });
    }
});



module.exports = router;
