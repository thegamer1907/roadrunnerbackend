var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var Axios = require('axios');
var pug = require('pug');
var path = require('path');
var VerifyToken = require(__root + 'auth/VerifyToken');
var config = require('../../config');


var User = require('../user/User');
var IsVendor = require('../isVendor/IsVendor');
var IsAdmin = require('../isAdmin/isAdmin');
var IsSuperuser = require('../isSuperuser/IsSuperuser');
var IsFinanceAdmin = require('../isFinanceAdmin/IsFinanceAdmin');
var UserHardCash = require('../userHardCash/UsernameHardCash');
var Transaction = require('../transaction/Transaction');
var TransactionDetails = require('../transactionDetails/TransactionDetails');
var CardDetails = require('../cardDetails/CardDetails');
var UsernameToCard = require('../usernameToCard/UsernameToCard');
var IsFoodAdmin = require('../isFoodAdmin/IsFoodAdmin');
var CardBalance = require('../cardBalance/CardBalance');
var CardPin = require('../cardPin/CardPin');
var Delivered = require('../delivered/Delivered');
var IDToCard = require('../idToCard/IDToCard');
var Transaction = require('../transaction/Transaction');
var TransactionDetails = require('../transactionDetails/TransactionDetails');
var TransactionSummary = require('../TransactionSummary/TransactionSummary');
var UsernameHardCash = require('../userHardCash/UsernameHardCash');
var CouponWinner = require('../couponWinners/CouponWinner');

const fetch = require('node-fetch');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

const maxCashback = parseFloat(config.maxCashback);
const anokhadomain = config.anokhadomain;
const conatctNumber = config.conatctNumber;


const couponmsg = pug.compileFile(path.join(__dirname, '../../views/coupon.pug'));

function generate_coupon_message(cardNo, name, id, amount) {
    return couponmsg({ cardNo: cardNo, name: name, anokhaID: id, amount: amount, number: conatctNumber });
}

async function send_mail(email, sub, message) {
    const transporter = await nodemailer.createTransport({
        host: config.emailConfig.host,
        port: config.emailConfig.port,
        secure: config.emailConfig.secure,
        auth: {
            user: config.emailConfig.username,
            pass: config.emailConfig.password
        }
    });
    const mailOptions = {
        from: 'Amrita E Wallet <' + config.emailConfig.username + '>',
        to: email,
        subject: sub,
        html: message
    };
    const A = await transporter.sendMail(mailOptions);
    return A;
}


// API GOES HERE
router.get('/', function (req, res) {
    res.status(200).send('Utility API Works');
});



router.get('/checkusername/:username', function (req, res) {

    User.findOne({ username: req.params.username }).then((obj) => {
        if (!obj) {
            res.status(200).send({ exists: 'false' });
        } else {
            res.status(200).send({ exists: 'true' });
        }

    }).catch((err) => {
        res.status(500).send({ msg: err.message });
    });
});


router.get('/grantSuperuser/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsSuperuser.findOneAndUpdate({ username: req.params.username }, { $set: { isSuperuser: true } }).then((obj) => {
            res.status(200).send({ msg: 'granted' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.get('/grantFinanceAdmin/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsFinanceAdmin.findOneAndUpdate({ username: req.params.username }, { $set: { isFinanceadmin: true } }).then((obj) => {
            res.status(200).send({ msg: 'granted' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});


router.get('/grantAdmin/:username', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        IsAdmin.findOneAndUpdate({ username: req.params.username }, { $set: { isAdmin: true } }).then((obj) => {
            res.status(200).send({ msg: 'granted' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


router.get('/grantVendor/:username', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        IsVendor.findOneAndUpdate({ username: req.params.username }, { $set: { isVendor: true } }).then((obj) => {
            res.status(200).send({ msg: 'granted' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


//change to revoke

router.get('/revokeSuperuser/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsSuperuser.findOneAndUpdate({ username: req.params.username }, { $set: { isSuperuser: false } }).then((obj) => {
            res.status(200).send({ msg: 'revoked' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});

router.get('/revokeFinanceAdmin/:username', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        IsFinanceAdmin.findOneAndUpdate({ username: req.params.username }, { $set: { isFinanceadmin: false } }).then((obj) => {
            res.status(200).send({ msg: 'revoked' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }
});


router.get('/revokeAdmin/:username', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        IsAdmin.findOneAndUpdate({ username: req.params.username }, { $set: { isAdmin: false } }).then((obj) => {
            res.status(200).send({ msg: 'revoked' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


router.get('/revokeVendor/:username', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        IsVendor.findOneAndUpdate({ username: req.params.username }, { $set: { isVendor: false } }).then((obj) => {
            res.status(200).send({ msg: 'revoked' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});

var addUser = async (obj) => {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        var hashedPassword = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36).substring(0, 6);
        var newUser = new User({
            name: obj.name,
            username: obj.username,
            password: hashedPassword,
            phoneNumber: obj.phoneNumber
        });
        var ret3 = await newUser.save();
        var newisAdmin = new IsAdmin({
            username: obj.username,
            isAdmin: true
        });
        ret3 = await newisAdmin.save();

        var newisSuperuser = new IsSuperuser({
            username: obj.username,
            isSuperuser: false
        });
        ret3 = await newisSuperuser.save();


        var newisVendor = new IsVendor({
            username: obj.username,
            isVendor: false
        });
        ret3 = await newisVendor.save();


        var newisFinanceAdmin = new IsFinanceAdmin({
            username: obj.username,
            isFinanceadmin: false
        });
        ret3 = await newisFinanceAdmin.save();

        var newisFoodAdmin = new IsFoodAdmin({
            username: obj.username,
            isFoodAdmin: false
        });
        ret3 = await newisFoodAdmin.save();

        var newUserHardCash = new UserHardCash({
            username: obj.username,
            amount: parseFloat(0)
        });
        ret3 = await newUserHardCash.save();

        await session.commitTransaction();
        await session.endSession();

        return true;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};


router.post('/registeradmin', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        addUser(req.body).then((obj) => {
            res.status(200).send({ msg: 'registered' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});

// fadmin add

var faddUser = async (obj) => {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        var hashedPassword = obj.password;
        var newUser = new User({
            name: obj.name,
            username: obj.username,
            password: hashedPassword,
            phoneNumber: obj.phoneNumber
        });
        var ret3 = await newUser.save();
        var newisAdmin = new IsAdmin({
            username: obj.username,
            isAdmin: true
        });
        ret3 = await newisAdmin.save();

        var newisSuperuser = new IsSuperuser({
            username: obj.username,
            isSuperuser: false
        });
        ret3 = await newisSuperuser.save();


        var newisVendor = new IsVendor({
            username: obj.username,
            isVendor: false
        });
        ret3 = await newisVendor.save();


        var newisFinanceAdmin = new IsFinanceAdmin({
            username: obj.username,
            isFinanceadmin: true
        });
        ret3 = await newisFinanceAdmin.save();

        var newisFoodAdmin = new IsFoodAdmin({
            username: obj.username,
            isFoodAdmin: true
        });
        ret3 = await newisFoodAdmin.save();

        var newUserHardCash = new UserHardCash({
            username: obj.username,
            amount: parseFloat(0)
        });
        ret3 = await newUserHardCash.save();

        await session.commitTransaction();
        await session.endSession();

        return true;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};


router.post('/registerfadmin', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        faddUser(req.body).then((obj) => {
            res.status(200).send({ message: 'registered' });
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser' });
    }
});

// add superuser


var saddUser = async (obj) => {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        var hashedPassword = obj.password;
        var newUser = new User({
            name: obj.name,
            username: obj.username,
            password: hashedPassword,
            phoneNumber: obj.phoneNumber
        });
        var ret3 = await newUser.save();
        var newisAdmin = new IsAdmin({
            username: obj.username,
            isAdmin: true
        });
        ret3 = await newisAdmin.save();

        var newisSuperuser = new IsSuperuser({
            username: obj.username,
            isSuperuser: true
        });
        ret3 = await newisSuperuser.save();


        var newisVendor = new IsVendor({
            username: obj.username,
            isVendor: false
        });
        ret3 = await newisVendor.save();


        var newisFinanceAdmin = new IsFinanceAdmin({
            username: obj.username,
            isFinanceadmin: true
        });
        ret3 = await newisFinanceAdmin.save();

        var newisFoodAdmin = new IsFoodAdmin({
            username: obj.username,
            isFoodAdmin: true
        });
        ret3 = await newisFoodAdmin.save();

        var newUserHardCash = new UserHardCash({
            username: obj.username,
            amount: parseFloat(0)
        });
        ret3 = await newUserHardCash.save();

        await session.commitTransaction();
        await session.endSession();

        return true;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};


router.post('/registersuser', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        saddUser(req.body).then((obj) => {
            res.status(200).send({ msg: 'registered' });
        }).catch((err) => {
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser' });
    }
});


// foodadmin

var foodaddUser = async (obj) => {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        var hashedPassword = obj.password;
        var newUser = new User({
            name: obj.name,
            username: obj.username,
            password: hashedPassword,
            phoneNumber: obj.phoneNumber
        });
        var ret3 = await newUser.save();
        var newisAdmin = new IsAdmin({
            username: obj.username,
            isAdmin: false
        });
        ret3 = await newisAdmin.save();

        var newisSuperuser = new IsSuperuser({
            username: obj.username,
            isSuperuser: false
        });
        ret3 = await newisSuperuser.save();


        var newisVendor = new IsVendor({
            username: obj.username,
            isVendor: false
        });
        ret3 = await newisVendor.save();


        var newisFinanceAdmin = new IsFinanceAdmin({
            username: obj.username,
            isFinanceadmin: false
        });
        ret3 = await newisFinanceAdmin.save();

        var newisFoodAdmin = new IsFoodAdmin({
            username: obj.username,
            isFoodAdmin: true
        });
        ret3 = await newisFoodAdmin.save();

        var newUserHardCash = new UserHardCash({
            username: obj.username,
            amount: parseFloat(0)
        });
        ret3 = await newUserHardCash.save();

        await session.commitTransaction();
        await session.endSession();

        return true;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

router.post('/registerfoodadmin', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        foodaddUser(req.body).then((obj) => {
            res.status(200).send({ msg: 'registered' });
        }).catch((err) => {
            //console.log(err);
            res.status(500).send({ msg: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});

// Delete Admin User
var deleteadmin = async (obj) => {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        const check = await UserHardCash.findOne({ username: obj.username });
        if (check.amount != 0)
            throw new Error('Can\'t Delete a Admin with cash in hand. Please collect the money.');

        const opts = { session };
        const A = await User.findOneAndRemove({ username: obj.username }, opts);
        const B = await IsAdmin.findOneAndRemove({ username: obj.username }, opts);
        const C = await IsSuperuser.findOneAndRemove({ username: obj.username }, opts);
        const D = await IsFinanceAdmin.findOneAndRemove({ username: obj.username }, opts);
        const E = await IsFoodAdmin.findOneAndRemove({ username: obj.username }, opts);
        const F = await UserHardCash.findOneAndRemove({ username: obj.username }, opts);
        const G = await IsVendor.findOneAndRemove({ username: obj.username }, opts);

        await session.commitTransaction();
        await session.endSession();

        return { message: "Admin Deleted Successfully!" };
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

router.post('/deleteadmin', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        deleteadmin(req.body).then((msg) => {
            res.status(200).send(msg);
        }).catch((err) => {
            res.status(500).send({ message: err.toString() });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as financeadmin' });
    }
});




// all transactions

router.get('/alltransactions', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        Transaction.find({}, { _id: 0 }).sort('-date').exec(function (err, transactions) {
            if (err) {
                res.status(500).send({ message: err.toString() });
                return;
            } else
                res.status(200).send({ list: transactions });
        })
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser' });
    }
});

// all transaction of a card

router.post('/alltranscard', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        Transaction.aggregate([{
            $match:{ $or: [{ fromCardNo: req.body.cardNo }, { toCardNo: req.body.cardNo }] }
        }, {
            $lookup: {
                from: 'transactiondetails',
                localField: 'transactionID',
                foreignField: 'transactionID',
                as: 'status'
            }
        }]).sort('-date').exec(function (err, transactions) {
            if (err)
                res.status(500).send({ message: err.toString() });
            else
                res.status(200).send({ list: transactions });
        });
        // Transaction.find({ $or: [{ fromCardNo: req.body.cardNo }, { toCardNo: req.body.cardNo }] }).sort('-date').exec(function (err, transactions) {
        //     if (err)
        //         res.status(500).send({ message: err.toString() });
        //     else
        //         res.status(200).send({ list: transactions });
        // })
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser' });
    }
});

// transaction details

router.get('/tdetails/:id', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        TransactionDetails.findOne({ transactionID: req.params.id }, function (err, transactions) {
            if (err)
                res.status(500).send({ message: err.toString() });
            else
                res.status(200).send({ details: transactions });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser' });
    }
});


// get all card

router.get('/getallc', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {

        CardDetails.aggregate([{
            $lookup: {
                from: 'cardbalances',
                localField: 'cardNo',
                foreignField: 'cardNo',
                as: 'cardBalance'
            }
        }, {
            "$unwind": "$cardBalance"
        }], function (err, docs) {
            //console.log(docs);
            if (err)
                res.status(500).send({ message: err.toString() });
            else
                res.status(200).send({ details: docs });
        });

    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser' });
    }
});





// diff
router.get('/getAllUsername', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        User.find({}, { password: 0, name: 0, _id: 0 }).then((obj) => {
            var data = [];
            for (let i = 0; i < obj.length; i++) {
                data.push(obj[i].username);
            }
            return res.status(200).send({ usernames: data });
        }).catch((err) => {
            return res.status(500).send({ message: err.message });
        })
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});


//Complete here accept money
var acceptMoney = async (username, amount, fusername) => {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);

        const A = await UserHardCash.findOne({ username: username });

        if (!A)
            throw new Error('Username does not exists');

        if (A.amount < parseFloat(amount))
            throw new Error('Cannot collect more money than what he has. P.S : Do not torture him');

        const newTransaction = {
            fromCardNo: '3' + '$###$' + username,
            toCardNo: '4' + '$###$' + fusername,
            amount: parseFloat(amount),
            transactionID: TID,
        }

        const newTransactionDetails = {
            transactionID: TID,
            orderDetails: "Amount Collected from " + username + " by " + fusername
        }

        const B = await UserHardCash.findOneAndUpdate({ username: username }, { $inc: { amount: -parseFloat(amount) } }, opts);

        const E = await UserHardCash.findOneAndUpdate({ username: fusername }, { $inc: { amount: parseFloat(amount) } }, opts);

        const C = await Transaction.create([newTransaction], opts);

        const D = await TransactionDetails.create([newTransactionDetails], opts);


        await session.commitTransaction();
        await session.endSession();
        return { message: 'success' };

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

};

router.post('/accept', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        acceptMoney(req.body.username, req.body.amount, req.username).then((obj) => {
            res.status(200).send(obj);
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});



//Complete here issue money
var issueMoney = async (username, amount, fusername) => {
    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);

        const A = await UserHardCash.findOne({ username: username });

        if (!A)
            throw new Error('Username does not exists');


        const Z = await UserHardCash.findOne({ username: fusername });

        if (!Z)
            throw new Error('Username does not exists');

        if (amount > parseFloat(Z.amount))
            throw new Error('Cannot Issue Money beyond your limit. Please Deposit money to your account.');


        const newTransaction = {
            fromCardNo: '4' + '$###$' + fusername,
            toCardNo: '3' + '$###$' + username,
            amount: parseFloat(amount),
            transactionID: TID,
        }

        const newTransactionDetails = {
            transactionID: TID,
            orderDetails: "Amount issued to " + username + " by " + fusername
        }

        const B = await UserHardCash.findOneAndUpdate({ username: username }, { $inc: { amount: parseFloat(amount) } }, opts);

        const E = await UserHardCash.findOneAndUpdate({ username: fusername }, { $inc: { amount: -parseFloat(amount) } }, opts);

        const C = await Transaction.create([newTransaction], opts);

        const D = await TransactionDetails.create([newTransactionDetails], opts);


        await session.commitTransaction();
        await session.endSession();
        return { message: 'success' };

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

router.post('/issue', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        issueMoney(req.body.username, req.body.amount, req.username).then((obj) => {
            res.status(200).send(obj);
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});

//

async function getTransactionForAdmin(username) {

    const A = await Transaction.find({ $or: [{ fromCardNo: '3' + '$###$' + username }, { toCardNo: '3' + '$###$' + username }] });
    if (!A) return { message: 'IE' };
    return { tlist: A };
}

router.get('/gettransactionforadmin/:username', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        getTransactionForAdmin(req.params.username).then((obj) => {
            res.status(200).send(obj);
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


//

async function getalluserhardcash() {
    const A = await IsAdmin.find({ isAdmin: true });

    const B = await UserHardCash.find({
        username: {
            "$in": A.map(function (el) {
                return el.username;
            })
        }
    }, { _id: 0, __v: 0 });

    return { list: B };
}

router.get('/getalluserhardcashusername', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        getalluserhardcash().then((obj) => {
            res.status(200).send(obj);
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});



async function adminTable() {
    var data = [];
    var fdata = [];
    var totalmoney = 0;
    var chk = await IsAdmin.find({ isAdmin: true });
    for (let i = 0; i < chk.length; i++) {
        var suchk = await IsSuperuser.findOne({ username: chk[i].username, isSuperuser: true });
        if (suchk)
            continue;
        var fnchk = await IsFinanceAdmin.findOne({ username: chk[i].username, isFinanceadmin: true });
        if (fnchk) {
            var user = await User.findOne({ username: chk[i].username });
            var usercash = await UserHardCash.findOne({ username: chk[i].username });
            data.push([user.username, user.name, usercash.amount, user.phoneNumber, '-']);
            fdata.push(user.username);
            totalmoney += usercash.amount;
            continue;
        }

        var user = await User.findOne({ username: chk[i].username });
        var usercash = await UserHardCash.findOne({ username: chk[i].username });
        data.push([user.username, user.name, usercash.amount, user.phoneNumber, user.password]);
        totalmoney += usercash.amount;
    }
    data.push(["~", "~", totalmoney, "~", "~"]);
    var ret = { data: data, fdata: fdata };
    return ret;
}



router.get('/getalluserhardcash', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        adminTable().then((obj) => {
            res.status(200).send(obj);
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


router.post('/resetpassword', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        var newPassword = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36).substring(0, 6);
        User.findOneAndUpdate({ username: req.body.username }, { $set: { password: newPassword } }).then((obj) => {
            res.status(200).send({ message: "success" });
        }).catch((err) => {
            res.status(500).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


async function vendorTransactionDateRange(vendor, startDate, endDate) {
    const A = await UsernameToCard.findOne({ username: vendor }, { _id: 0 });
    if (!A) { throw new Error('Not Linked'); }
    const cardNo = A.cardNo;
    // const B = await Transaction.find({ toCardNo: cardNo, date: { "$gte": startDate, "$lte": endDate } }).sort('-date');
    const B = await Transaction.aggregate([{
        $match: { toCardNo: cardNo, date: { "$gte": startDate, "$lte": endDate } }
    }, {
        $lookup: {
            from: 'transactiondetails',
            localField: 'transactionID',
            foreignField: 'transactionID',
            as: 'status'
        }
    }]).sort('-date');
    // const C = await Transaction.find({ fromCardNo: cardNo, date: { "$gte": startDate, "$lte": endDate } }).sort('-date');
    const C = await Transaction.aggregate([{
        $match:{ fromCardNo: cardNo, date: { "$gte": startDate, "$lte": endDate } }
    }, {
        $lookup: {
            from: 'transactiondetails',
            localField: 'transactionID',
            foreignField: 'transactionID',
            as: 'status'
        }
    }]).sort('-date');
    return { tlist: B, refundlist: C };
}

router.post('/vendortransactiondaterange', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        var vendor = req.body.vendor;
        var startDate = (new Date(req.body.startDate));
        var endDate = (new Date(req.body.endDate));
        vendorTransactionDateRange(vendor, startDate, endDate).then((TList) => {
            res.status(200).send(TList);
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


async function sendContactForm(name, email, phoneNumber, message) {

    config.notifyme.forEach(async (superuser) => {
        const A = await send_mail(superuser, 'Message form ' + name, 'Name : ' + name + '<br>' + 'Phone Number' + phoneNumber + '<br>' + 'Email ID : ' + email + '<br>' + 'Message : ' + message);
    });
    return { message: 'Thanks we will get back to you shortly' };
}

router.post('/contactform', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var phoneNumber = req.body.phoneNumber;
    var message = req.body.msg;


    sendContactForm(name, email, phoneNumber, message).then((message) => {
        res.status(200).send(message);
    }).catch((err) => {
        res.status(200).send({ message: 'Some Error Occured Please Try again Later' });
    })

});


async function getcmsdata(username) {
    const C = await Axios.get('https://anokha.amrita.edu/api/wallet/user-data?anokha_id=' + username);
    return C.data.data;

}

router.post('/getcmsdata', VerifyToken, function (req, res) {
    if (req.admin === 'true') {

        getcmsdata(req.body.username).then((details) => {
            res.status(200).send(details);
        }).catch((err) => {
            // console.log(err);
            res.status(400).send({ message: 'No such user exists' });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});


async function selfdepositmoney(username, amount) {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {

        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);

        const A = await UserHardCash.findOne({ username: username });

        if (!A)
            throw new Error('Username does not exists');

        const newTransaction = {
            fromCardNo: '0',
            toCardNo: '4' + '$###$' + username,
            amount: parseFloat(amount),
            transactionID: TID,
        }

        const newTransactionDetails = {
            transactionID: TID,
            orderDetails: "Amount issued to " + username + " by Amrita."
        }

        const B = await UserHardCash.findOneAndUpdate({ username: username }, { $inc: { amount: parseFloat(amount) } }, opts);

        const C = await Transaction.create([newTransaction], opts);

        const D = await TransactionDetails.create([newTransactionDetails], opts);


        await session.commitTransaction();
        await session.endSession();
        return { message: 'Money Updated Successfully' };

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

};


router.post('/selfdeposit', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        selfdepositmoney(req.username, req.body.amount).then((msg) => {
            res.status(200).send(msg);
        }).catch((err) => {
            res.status(400).send({ message: err.toString() });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});

// Random Cashback 

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function CashbackProcess(TID, adminUser) {

    const Z = await Transaction.findOne({ transactionID: TID });

    if (!Z)
        throw new Error('Transaction doesn\'t exist');

    const cardNo = Z.fromCardNo;
    const amount = Z.amount;

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: cardNo });

        if (cardPIN) {

            var user_ = await CardDetails.findOne({ cardNo: cardNo });
            const fromCardDoc = await IDToCard.findOne({ cardNo: cardNo });
            const newTransaction = {
                fromCardNo: '0' + '$###$' + 'Cashback',
                toCardNo: cardNo,
                amount: parseFloat(amount),
                transactionID: TID,
            }

            const newTransactionDetails = {
                transactionID: TID,
                orderDetails: "Cashback Amount added by userID : " + adminUser + " to " + cardNo
            }

            const newTransactionSummary = {
                transactionID: TID,
                cardNo: cardNo,
                phoneNumber: user_.phoneNumber,
                amount: parseFloat(amount)
            }

            const data = {
                cardNo: cardNo,
                amount: parseFloat(amount),
                details: 'Random'
            }

            const A = await CardBalance.findOneAndUpdate({ cardNo: cardNo }, { $inc: { balance: parseFloat(amount) } }, opts);

            const B = await Transaction.create([newTransaction], opts);

            const C = await TransactionDetails.create([newTransactionDetails], opts);

            const D = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: parseFloat(amount) } }, opts);

            const E = await TransactionSummary.create([newTransactionSummary], opts);

            const F = await CouponWinner.create([data], opts);

            const reqA = await fetch(anokhadomain + '/api/wallet/add-transaction', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ anokha_id: fromCardDoc.idCard, tid: TID, vendor_name: 'Amrita Wallet', details: newTransactionDetails.orderDetails, amount: parseFloat(amount), transacted_at: Date(Date.now()).toString().split('GMT')[0].trim() })
            });

            const conA = await reqA.json();

            if (conA['success'] != true) {
                // console.log(conA['success']);
                throw new Error("Anokha Server : " + conA['error']);
            }

            await session.commitTransaction();
            await session.endSession();
            return { message: 'CashBack Added Successfully.' };

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}

router.post('/cashbackprocess', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        var TID = req.body.TID;
        var user = req.username;
        CashbackProcess(TID, user).then((message) => {
            res.status(200).send(message);
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});

async function randomCashback(startDate, endDate, maxCashback, minCashback) {
    // console.log(maxCashback);
    const A = await Transaction.aggregate([{
        $match: {
            toCardNo: { '$regex': 'AWESHOP', '$options': 'i' },
            fromCardNo: { '$regex': 'AWE', '$options': 'i' },
            date: { "$gte": startDate, "$lte": endDate },
            amount: { "$lte": parseFloat(maxCashback), "$gte" : parseFloat(minCashback) }
        }
    }, {
        $lookup: {
            from: 'delivereds',
            localField: 'transactionID',
            foreignField: 'transactionID',
            as: 'status'
        }
    }, {
        $unwind: "$status"
    }, {
        $match: {
            'status.status': true
        }
    }]);
    // console.log(A);
    const B = A[getRandomInt(A.length)];
    if (!B)
        throw new Error('No Transactions Avilable');
    return { message: 'done', fromCardNo: B.fromCardNo, toCardNo: B.toCardNo, amount: B.amount, transactionID: B.transactionID, date: B.date, orderDetails: B.status.orderDetails };
}

router.post('/cashback', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        var startDate = (new Date(req.body.startDate));
        var endDate = (new Date(req.body.endDate));
        var user = req.username;
        var maxCashback = req.body.maxCashback;
        var minCashback = req.body.minCashback;
        randomCashback(startDate, endDate, maxCashback,minCashback).then((message) => {
            res.status(200).send(message);
        }).catch((err) => {
            res.status(400).send({ message: err.message });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});





// Update Delivery

async function UpdateDelivery(TID) {
    const A = await Delivered.findOne({ transactionID: TID });
    if (!A)
        throw new Error('No Such Transaction Found');
    const B = await Delivered.findOneAndUpdate({ transactionID: TID }, { $set: { status: true } });
    return { message: 'Done' };
}

router.post('/update-delivery', VerifyToken, function (req, res) {
    var TID = req.body.TID;
    UpdateDelivery(TID).then((msg) => {
        res.status(200).send(msg);
    }).catch((err) => {
        res.status(400).send({ message: err.toString() });
    });
});

// user-stat
async function perUser(startDate, endDate) {
    // console.log(maxCashback);
    const A = await Transaction.aggregate([{
        $match: {
            toCardNo: { '$regex': 'AWESHOP', '$options': 'i' },
            fromCardNo: { '$regex': 'AWE', '$options': 'i' },
            date: { "$gte": startDate, "$lte": endDate },
        }
    }, {
        $lookup: {
            from: 'delivereds',
            localField: 'transactionID',
            foreignField: 'transactionID',
            as: 'status'
        }
    }, {
        $unwind: "$status"
    }, {
        $match: {
            'status.status': true
        }
    }, {
        $group: {
            _id: "$fromCardNo",
            totalAmount: { $sum: "$amount" }
        }
    }]);

    return { data: A };
}

router.post('/peruserstat', VerifyToken, function (req, res) {
    if (req.superuser == 'true') {
        var startDate = (new Date(req.body.startDate));
        var endDate = (new Date(req.body.endDate));
        perUser(startDate, endDate).then((msg) => {
            // console.log(msg);
            res.status(200).send(msg);
        }).catch((err) => {
            res.status(400).send({ message: err.toString() });
        });
    }
    else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});

// Transaction List By time
async function transactionbytime(startDate, endDate) {
    // console.log(maxCashback);
    const A = await Transaction.aggregate([{
        $match: {
            toCardNo: { '$regex': 'AWESHOP', '$options': 'i' },
            fromCardNo: { '$regex': 'AWE', '$options': 'i' },
            date: { "$gte": startDate, "$lte": endDate },
        }
    }, {
        $lookup: {
            from: 'delivereds',
            localField: 'transactionID',
            foreignField: 'transactionID',
            as: 'status'
        }
    }, {
        $unwind: "$status"
    }, {
        $match: {
            'status.status': true
        }
    }]);

    return { data: A };
}


router.post('/transactionbytime', VerifyToken, function (req, res) {
    if (req.superuser == 'true') {
        var startDate = (new Date(req.body.startDate));
        var endDate = (new Date(req.body.endDate));
        transactionbytime(startDate, endDate).then((msg) => {
            // console.log(msg);
            res.status(200).send(msg);
        }).catch((err) => {
            res.status(400).send({ message: err.toString() });
        });
    }
    else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});





// Refund Transaction

async function refundTransaction(TIDM, pin) {
    const Z = await Transaction.findOne({ transactionID: TIDM });
    if (!Z)
        throw new Error('No Such Transaction Found');

    const Y = await TransactionDetails.findOne({ orderDetails: 'Refund for Transaction ID : ' + TIDM });

    if (Y)
        throw new Error('A Transaction can be Reversed Only once. Trying to be smart aah..? P.S : System is smarter than you think becoz of its developers');


    var fromCardNo = Z.toCardNo;
    var toCardNo = Z.fromCardNo;

    var amount = parseFloat(Z.amount);

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const fromCardDoc = await IDToCard.findOne({ cardNo: fromCardNo });
        const toCardDoc = await IDToCard.findOne({ cardNo: toCardNo });
        const validtocard = await CardDetails.findOne({ cardNo: toCardNo });
        const validfromcard = await CardDetails.findOne({ cardNo: fromCardNo });

        if (!validfromcard || !validtocard)
            throw new Error('This transaction cannot be reversed');

        if (toCardDoc && !fromCardDoc) {

            const fromUser = await CardDetails.findOne({ cardNo: fromCardNo });
            const toUser = await CardDetails.findOne({ cardNo: toCardNo });
            const vendorname = await UsernameToCard.findOne({ cardNo: fromCardNo });
            const pinDoc = await CardPin.findOne({ cardNo: fromCardNo, pin: pin });
            if (!pinDoc)
                throw new Error("Wrong Pin!");
            const newTransaction = {
                fromCardNo: fromCardNo,
                toCardNo: toCardNo,
                amount: amount,
                transactionID: TID
            }

            const newTransactionDetails = {
                transactionID: TID,
                orderDetails: 'Refund for Transaction ID : ' + TIDM
            }

            const TransactionSummaryA = {
                amount: -amount,
                transactionID: TID,
                cardNo: fromCardNo,
                phoneNumber: fromUser.phoneNumber
            }

            const TransactionSummaryB = {
                amount: amount,
                transactionID: TID,
                cardNo: toCardNo,
                phoneNumber: toUser.phoneNumber
            }

            const A = await CardBalance.findOneAndUpdate({ cardNo: fromCardNo }, { $inc: { balance: -amount } }, opts);

            if (A.balance < 0) {
                throw new Error("Insufficient Balance");
            }

            const B = await CardBalance.findOneAndUpdate({ cardNo: toCardNo }, { $inc: { balance: amount } }, opts);

            const C = await Transaction.create([newTransaction], opts);

            const D = await TransactionDetails.create([newTransactionDetails], opts);

            const E = await TransactionSummary.create([TransactionSummaryA, TransactionSummaryB], opts);

            const F = await Delivered.findOneAndDelete({ transactionID: TIDM });


            const reqA = await fetch(anokhadomain + '/api/wallet/add-transaction', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ anokha_id: toCardDoc.idCard, tid: TID, vendor_name: vendorname.username, details: newTransactionDetails.orderDetails, amount: amount, transacted_at: Date(Date.now()).toString().split('GMT')[0].trim() })
            });

            const conA = await reqA.json();

            if (conA['success'] != true) {
                // console.log(conA['success']);
                throw new Error("Anokha Server : " + conA['error']);
            }

            await session.commitTransaction();
            await session.endSession();
            return { message: 'Operation Successfull.\nUpdated Balance : ' + B.balance + ' Rs.', balance: B.balance };

        } else {
            throw new Error('Invalid reverse Check for card Numbers');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

}


router.post('/refundtransaction', VerifyToken, function (req, res) {
    var TID = req.body.TID;
    var pin = req.body.pin;

    refundTransaction(TID, pin).then((msg) => {
        res.status(200).send(msg);
    }).catch((err) => {
        res.status(400).send({ message: err.toString() });
    });
});

// GET undelivered Trnasction


async function getUndelivered(username) {
    const B = await UsernameToCard.findOne({ username: username });
    if (!B)
        throw new Error('Username not linked to card');
    const A = await Delivered.find({ toCardNo: B.cardNo, status: false }, { _id: 0, status: 0 });
    return { data: A };
}

router.get('/getUndelivered', VerifyToken, function (req, res) {

    var username = req.username;

    getUndelivered(username).then((msg) => {
        res.status(200).send(msg);
    }).catch((err) => {
        res.status(400).send({ message: err.toString() });
    });
});

// COUPON MAIL

async function couponMailController(cardNo, amount) {
    const A = await CardDetails.findOne({ cardNo: cardNo });
    const B = await IDToCard.findOne({ cardNo: cardNo });
    const data = {
        cardNo: cardNo,
        amount: parseFloat(amount),
        details: 'Coupon'
    }
    const C = await CouponWinner.create([data]);
    return { email: A.email, name: A.name, id: B.idCard };
}


router.post('/sendcouponmail', VerifyToken, function (req, res) {

    if (req.superuser == 'true') {
        var username = req.username;
        var cardNo = req.body.cardNo;
        var amount = req.body.amount;
        couponMailController(cardNo, amount).then((message) => {
            send_mail(message.email, 'Coupon', generate_coupon_message(cardNo, message.name, message.id, amount)).then((msg) => {
                return res.status(200).send({ message: 'Done' });
            }).catch((err) => {
                //console.log(err);
                return res.status(417).send({ message: 'Mail was not sent' });
            });
        }).catch((err) => {
            res.status(400).send({ message: err.toString() });
        });
    }
    else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate token as superuser or finance admin.' });
    }
});


async function getCouponWinners() {
    const A = await CouponWinner.find({}, { _id: 0 });
    return A;
}

router.get('/couponwinners', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        getCouponWinners().then((msg) => {
            return res.status(200).send({ message: 'success', data: msg });
        }).catch((err) => {
            res.status(400).send({ message: err.toString() });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate as superuser or finance admin' })
    }
})

async function sendnotification(title, body) {
    const reqA = await fetch(anokhadomain + '/api/wallet/notify', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title : title, body : body })
    });

    const conA = await reqA.json();

    if (conA['success'] != true) {
        // console.log(conA['success']);
        throw new Error("Anokha Server : " + conA['error']);
    }

    return conA['message'];
}


router.post('/sendnotification', VerifyToken, function (req, res) {
    if (req.superuser === 'true') {
        sendnotification(req.body.title, req.body.body).then((msg) => {
            return res.status(200).send({ message: msg });
        }).catch((err) => {
            res.status(400).send({ message: err.toString() });
        });
    } else {
        return res.status(403).send({ auth: false, message: 'Failed to authenticate as superuser or finance admin' })
    }
})




module.exports = router;