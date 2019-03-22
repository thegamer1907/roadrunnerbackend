var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));

var Items = require('./items');
var config = require('../../config');

router.post('/', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        Items.create({
            username: req.body.username,
            itemName: req.body.itemName,
            price: parseFloat(req.body.price)
        },
            function (err, item) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send({ message: "added", itemdetails: item });
            });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }

});

router.get('/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        Items.findOne({ username: req.params.username }, { _id: 0 }, function (err, items) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!items) return res.status(404).send("No items found.");
            res.status(200).send({ list: items });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.delete('/:username/:itemname', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        Items.findOneAndDelete({ username: req.params.username, itemName: req.params.itemname }, function (err, items) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!items) return res.status(404).send("No items found.");
            res.status(200).send({ list: items });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.post('/update/:username/:itemname', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        Items.updateOne({ username: req.params.username, itemName: req.params.itemname }, { $set: { itemName: req.body.itemName, price: parseFloat(request.body.price) } }, function (err, items) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (!items) return res.status(404).send("No items found.");
            res.status(200).send({ list: items });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});



module.exports = router;
