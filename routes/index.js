var express = require('express');
var path = require('path');
var router = express.Router();
var VerifyToken = require('./auth/VerifyToken');

 /* GET home page. */
// router.get('/', function (req, res, next) {
//     res.sendFile(path.join(__dirname, '../public/landingmain.html'));
// });


// router.get('/login', function (req, res, next) {
//     res.sendFile(path.join(__dirname, '../public/login.html'));
// });

// router.get('/home', function (req, res, next) {
//     res.sendFile(path.join(__dirname, '../public/home.html'));
// });

// router.get('/getUI', VerifyToken, function (req, res, next) {
//     if (req.superuser === 'true') {
//         res.sendFile(path.join(__dirname, '../ui/superuser.html'));
//         return;
//     }
//     else if (req.financeadmin === 'true') {
//         res.sendFile(path.join(__dirname, '../ui/fadmin.html'));
//         return;
//     }
//     else if (req.admin === 'true') {
//         res.sendFile(path.join(__dirname, '../ui/admin.html'));
//         return;
//     }
//     else if (req.foodadmin === 'true') {
//         res.sendFile(path.join(__dirname, '../ui/food.html'));
//         return;
//     }
//     else {
//         res.status(400).send('Not allowed');
//         return;
//     }
// });


// router.get('/app', function (req, res, next) {
//     var file = './../apk/ewallet.apk';
//     res.download(file);
//     // res.sendFile(path.join(__dirname, '../public/couponwinners.html'));
// })


module.exports = router;

