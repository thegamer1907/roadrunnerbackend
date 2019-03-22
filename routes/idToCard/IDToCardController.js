var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var IDToCard = require('./IDToCard');
var config = require('../../config');

router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IDToCard.create({
            cardNo: req.body.cardNo,
            idCard: req.body.idCard
        },
            function (err, cards) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(cards);
            });
    }
});


router.get('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IDToCard.find({}, function (err, cards) {
            if (err) return res.status(500).send("There was a problem finding the cards.");
            res.status(200).send(cards);
        });
    }
});



router.post('/deleteCard', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IDToCard.findOneAndDelete({ cardNo: req.body.cardNo }, function (err, cards) {
            if (err) return res.status(500).send("There was a problem deleting the card.");
            res.status(200).send(cards);
        });
    }
});




module.exports = router;
