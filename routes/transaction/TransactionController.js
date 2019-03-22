var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var Transaction = require('./Transaction');
var config = require('../../config');


router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        var tid = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        Transaction.create({
            fromCardNo: req.body.fromCardNo,
            toCardNo: req.body.toCardNo,
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
        Transaction.find({}, function (err, trans) {
            if (err) return res.status(500).send("There was a problem finding the transactions.");
            res.status(200).send(trans);
        });
    }
});



router.post('/updateTransaction', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        Transaction.updateOne({ transactionID: req.body.transactionID },
            { $set: { fromCardNo: req.body.fromCardNo, toCardNo: req.body.toCardNo, amount: parseFloat(req.body.amount) } }, function (err, trans) {
                if (err) return res.status(500).send("There was a problem updating the cards.");
                res.status(200).send(trans);
            });
    }
});


router.post('/deleteTransaction', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        Transaction.findOneAndDelete({ transactionID: req.body.transactionID }, function (err, trans) {
            if (err) return res.status(500).send("There was a problem deleting the transaction.");
            res.status(200).send(trans);
        });
    }
});


module.exports = router;
