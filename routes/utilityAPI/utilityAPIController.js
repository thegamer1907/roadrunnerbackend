var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// var nodemailer = require('nodemailer');
// var Axios = require('axios');
var pug = require('pug');
var path = require('path');
var singlemarathon = require('../singlemarathon/singlemarathon');
var VerifyToken = require(__root + 'auth/VerifyToken');
var config = require('../../config');


var User = require('../user/User');
var Event = require('../events/events');

// const fetch = require('node-fetch');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/events', function(req,res){
    Event.find({},{_id:0}).then((obj) => {
        res.status(200).send({data : obj});
    }).catch((err) => {
        res.status(400).send({message : err.toString()});
    });
});

router.get('/single', VerifyToken ,function(req,res){
    singlemarathon.findOne({username : req.username},{_id:0}).then((obj) => {
        res.status(200).send({data : obj});
    }).catch((err) => {
        res.status(400).send({message : err.toString()});
    });
});


router.post('/updatesingle', VerifyToken ,function(req,res){
    // console.log(req.body.update);
    singlemarathon.findOneAndUpdate({username : req.username},{ $set : req.body.update }).then((obj) => {
        res.status(200).send({message : "Updated Successfully"});
    }).catch((err) => {
        res.status(400).send({message : err.toString()});
    });
});


module.exports = router;