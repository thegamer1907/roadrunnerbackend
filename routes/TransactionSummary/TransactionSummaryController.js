var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var TransactionSummary = require('./TransactionSummary');
var config = require('../../config');


router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        var tid = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        TransactionSummary.create({
            cardNo: req.body.cardNo,
            phoneNumber: req.body.phoneNumber,
            transactionID: tid,
            amount: parseFloat(req.body.amount)
        },
            function (err, trans) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send(trans);
            });
    }
});


router.get('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionSummary.find({}, function (err, trans) {
            if (err) return res.status(500).send("There was a problem finding the transactions.");
            res.status(200).send(trans);
        });
    }
});



router.post('/updateTransactionSummary', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionSummary.updateOne({ transactionID: req.body.transactionID },
            {
                $set:
                {
                    phoneNumber: req.body.phoneNumber,
                    transactionID: tid,
                    amount: parseFloat(req.body.amount)
                }
            }, function (err, trans) {
                if (err) return res.status(500).send("There was a problem updating the cards.");
                res.status(200).send(trans);
            });
    }
});


router.post('/deleteTransactionSummary', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionSummary.findOneAndDelete({ transactionID: req.body.transactionID }, function (err, trans) {
            if (err) return res.status(500).send("There was a problem deleting the transaction.");
            res.status(200).send(trans);
        });
    }
});


module.exports = router;
