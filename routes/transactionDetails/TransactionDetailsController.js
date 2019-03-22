var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var TransactionDetails = require('./TransactionDetails');
var config = require('../../config');

router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionDetails.create({
            transactionID: req.body.transactionID,
            orderDetails: req.body.orderDetails,
        },
            function (err, item) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send({ message: "added", transaction: item });
            });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }

});

router.get('/:transactionID', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionDetails.findOne({ transactionID: req.params.transactionID }, { _id: 0 }, function (err, transaction) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!transaction) return res.status(404).send("No items found.");
            res.status(200).send({ data: transaction });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.delete('/:transactionID', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionDetails.findOneAndDelete({ transactionID: req.params.transactionID }, function (err, items) {
            if (err) return res.status(500).send("There was a problem finding the transaction.");
            if (!items) return res.status(404).send("No items found.");
            res.status(200).send({ list: items });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.post('/update/:transactionID', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionDetails.updateOne({ transactionID: req.params.transactionID }, { $set: { orderDetails: req.body.orderDetails } }, function (err, items) {
            if (err) return res.status(500).send("There was a problem finding the transaction.");
            if (!items) return res.status(404).send("No items found.");
            res.status(200).send({ list: items });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.get('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        TransactionDetails.find({}, { _id: 0 }, function (err, transaction) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!transaction) return res.status(404).send("No items found.");
            res.status(200).send({ data: transaction });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});



module.exports = router;