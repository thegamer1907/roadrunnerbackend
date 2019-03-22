var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var config = require('../../config');


var User = require('../user/User');
var IsVendor = require('../isVendor/IsVendor')
var items = require('../items/items');


var addVendor = require('./utility/addVendor');
var addItem = require('./utility/addItem');
var linkCard = require('./utility/linkUserCard');
var getAllVendors = require('./utility/getAllVendors');


// API GOES HERE
router.get('/', function (req, res) {
  res.status(200).send('Vendor API Works');
});



router.post('/registerVendor', VerifyToken, function (req, res) {
  if (req.foodadmin === 'true' || req.financeadmin === 'true') {
    addVendor(req.body).then((user) => {
      res.status(200).send({ message: "success" });
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  }
  else {
    res.status(403).send({ auth: false, message: 'Failed to authenticate token as admin.' });
  }
});


router.post('/linkUserCard', VerifyToken, function (req, res) {
  if (req.financeadmin === 'true') {
    linkCard(req.body.username, req.body.cardNo).then((user) => {
      res.status(200).send({ message: 'success' });
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  }
  else {
    res.status(403).send({ auth: false, message: 'Failed to authenticate token as admin.' });
  }
});


router.post('/addItem', VerifyToken, function (req, res) {
  if (req.foodadmin === 'true' || req.financeadmin === 'true') {
    addItem(req.body).then((item) => {
      res.status(200).send({ message: 'success' });
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  }
  else {
    res.status(403).send({ auth: false, message: 'Failed to authenticate token as admin.' });
  }
});



router.post('/deleteItem', VerifyToken, function (req, res) {
  if (req.foodadmin === 'true' || req.financeadmin === 'true') {
    items.findOneAndDelete({ username: req.body.username, itemName: req.body.itemName }).then((obj) => {
      res.status(200).send({ message: 'success' });
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  }
  else {
    res.status(403).send({ auth: false, message: 'Failed to authenticate token as admin.' });
  }
});


router.get('/getItems/:username', function (req, res) {
  items.find({ username: req.params.username }, { username: 0, _id: 0, __v: 0 }).then((obj) => {
    res.status(200).send({ data: obj });
  }).catch((err) => {
    res.status(500).send({ message: err.message });
  });
});


router.get('/getAllVendors', VerifyToken, function (req, res) {
  
    getAllVendors().then((obj) => {
      res.status(200).send({ data: obj });
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
});

async function getAllDetails() {
  const A = await IsVendor.aggregate([{ $match: { isVendor: true } }, {
    $lookup: {
      from: 'users',
      localField: 'username',
      foreignField: 'username',
      as: 'userDetails'
    }
  }, {
    $lookup: {
      from: 'usernametocards',
      localField: 'username',
      foreignField: 'username',
      as: 'cardDetails'
    }
  }]);
  return A;
}

router.get('/getAllDetails', VerifyToken, function (req, res) {
  if (req.financeadmin === 'true') {
    getAllDetails().then((message) => {
      res.status(200).send({ data: message });
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  }
  else {
    res.status(403).send({ auth: false, message: 'Failed to authenticate token as financeadmin.' });
  }
});



async function getAllSales() {
  const A = await IsVendor.aggregate([{ $match: { isVendor: true } }, {
    $lookup: {
      from: 'users',
      localField: 'username',
      foreignField: 'username',
      as: 'userDetails'
    }
  }, {
    $lookup: {
      from: 'usernametocards',
      localField: 'username',
      foreignField: 'username',
      as: 'cardDetails'
    }
  }, {
    $lookup: {
      from: 'cardbalances',
      localField: 'cardDetails.cardNo',
      foreignField: 'cardNo',
      as: 'cardbalance'
    }
  }
]);
  return A;
}

router.get('/getAllSales', VerifyToken, function (req, res) {
  if (req.financeadmin === 'true') {
    getAllSales().then((message) => {
      res.status(200).send({ data: message });
    }).catch((err) => {
      res.status(500).send({ message: err.message });
    });
  }
  else {
    res.status(403).send({ auth: false, message: 'Failed to authenticate token as financeadmin.' });
  }
});


module.exports = router;
