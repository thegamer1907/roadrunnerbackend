var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var singlemarathon = require('../singlemarathon/singlemarathon');
var info = require('../info/info');
var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');
var bouncer = require('./bouncer');


var jwt = require('jsonwebtoken');
var config = require('../../config');



//Change Password

async function changePassword(oldPassword, newPassword, username) {

    const S = await IsFinanceAdmin.findOne({username : username});
    if(!S.isFinanceadmin)
        throw new Error('You are not allowed to change your password. :(');

    const A = await User.findOne({ username: username });
    if (!A)
        throw new Error("Invalid username. Please try again");
    var passwordIsValid = A.password === oldPassword;
    if (!passwordIsValid)
        throw new Error("Invalid Password. Please try again");
    var hashedPassword = newPassword;
    const B = await User.findOneAndUpdate({ username: username }, { $set: { password: hashedPassword } });
    var ret = { message: "Password changed successfully" };
    return ret;
}


router.post('/changepassword', function (req, res) {
    changePassword(req.body.oldPassword, req.body.newPassword, req.body.username).then((obj) => {
        res.status(200).send(obj);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});


async function register(name, email, username, dob,password,phoneNumber,gender,photoURL){

    var d = new Date(dob + " 00:00");
    // console.log(dob + " 00:00");
    // console.log(d);
    var data = {
        name,
        email,
        username,
        password,
        phoneNumber,
        dob:d,
        gender,
        photoURL,
        role : 'user'
    };

    const A = await User.create([data]);

    const B = await singlemarathon.create([{username}]);

    const C = await info.create([{username}]);

    return {message : "Registered Successfully"};

}

router.post('/register', function (req, res) {
    register(req.body.name, req.body.email, req.body.username,req.body.dob,req.body.password,req.body.phoneNumber,req.body.gender,req.body.photoURL).then((obj) => {
        res.status(200).send(obj);
    }).catch((err) => {
        res.status(500).send({ message: err.toString() });
    });
});


//Reset Password

async function resetPassword(username) {

    const A = await User.findOne({ username: username });
    if (!A)
        throw new Error("Invalid username. Please try again");
    var hashedPassword = "anokha2019";
    const B = await User.findOneAndUpdate({ username: username }, { $set: { password: hashedPassword } });
    var ret = { message: "Password reset successfully" };
    return ret;
}


router.post('/resetpassword', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        resetPassword(req.body.username).then((obj) => {
            res.status(200).send(obj);
        }).catch((err) => {
            res.status(500).send({ message: err.toString() });
        });
    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }

});


router.post('/login',function (req, res) {

    // console.log("here");
    User.findOne({ username: req.body.username },{_id : 0}, async function (err, user) {
        if (err) return res.status(500).send({message : err.toString()});
        if (!user) return  res.status(400).send({ message: 'Invalid Credentials' });


        var passwordIsValid = req.body.password === user.password;
        if (!passwordIsValid) return res.status(400).send({ auth: false, token: null, message : 'Invalid Credentials' });

        var roles = user.role;

        var token = jwt.sign({ id: user._id, roles: roles, username: user.username }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        const A = await info.findOne({username : req.body.username});
        res.status(200).send({ auth: true, token: token, user: user, score : A.points});
    });
});

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

// router.post('/register', async function (req, res) {

//     console.log(req.body);

//     const obj = req.body;

//     const session = await mongoose.startSession();
//     await session.startTransaction();

//     try {

//         var newUser = new User({
//             name: obj.name,
//             username: obj.username,
//             password: obj.password,
//             phoneNumber: obj.phoneNumber
//         });
//         var ret3 = await newUser.save();
//         var newisAdmin = new IsAdmin({
//             username: obj.username,
//             isAdmin: false
//         });
//         ret3 = await newisAdmin.save();

//         var newisSuperuser = new IsSuperuser({
//             username: obj.username,
//             isSuperuser: false
//         });
//         ret3 = await newisSuperuser.save();


//         var newisVendor = new IsVendor({
//             username: obj.username,
//             isVendor: false
//         });
//         ret3 = await newisVendor.save();


//         var newisFinanceAdmin = new IsFinanceAdmin({
//             username: obj.username,
//             isFinanceadmin: false
//         });
//         ret3 = await newisFinanceAdmin.save();

//         var newisFoodAdmin = new IsFoodAdmin({
//             username: obj.username,
//             IsFoodAdmin: false
//         });
//         ret3 = await newisFoodAdmin.save();

//         var newUserHardCash = new UserHardCash({
//             username: obj.username,
//             amount: parseFloat(0)
//         });
//         ret3 = await newUserHardCash.save();


//         await session.commitTransaction();
//         await session.endSession();

//         var token = jwt.sign({ id: user._id, roles: 'User', username: user.username }, config.secret, {
//             expiresIn: 86400
//         });

//         res.status(200).send({ auth: true, token: token, username: req.body.username });

//     } catch (error) {
//         await session.abortTransaction();
//         await session.endSession();
//         res.status(400).send("There was a problem registering the user. " + error.toString());
//     }

// });

router.get('/me', VerifyToken, function (req, res, next) {
    // console.log(req.userId);
    User.findById(req.userId, { password: 0, _id: 0, __v: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send({ 'data': user, 'roles': req.roles });
    });

});

module.exports = router;