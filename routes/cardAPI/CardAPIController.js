var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
var pug = require('pug');

var VerifyToken = require(__root + 'auth/VerifyToken');

router.use(bodyParser.urlencoded({ extended: true }));
var config = require('../../config');

var CardPin = require('../cardPin/CardPin');
var CardBalance = require('../cardBalance/CardBalance');
var Transaction = require('../transaction/Transaction');
var TransactionDetails = require('../transactionDetails/TransactionDetails');
var CardDetails = require('../cardDetails/CardDetails');
var IDToCard = require('../idToCard/IDToCard');
var UsernameToCard = require('../usernameToCard/UsernameToCard');
var UsernameHardCash = require('../userHardCash/UsernameHardCash');
var TransactionSummary = require('../TransactionSummary/TransactionSummary');
var AllCardDetails = require('../allCardDetails/AllCardDetails');
var IsAdmin = require('../isAdmin/isAdmin');
var IsVendor = require('../isVendor/IsVendor');
var IsSuperuser = require('../isSuperuser/IsSuperuser');
var IsFinanceAdmin = require('../isFinanceAdmin/IsFinanceAdmin');
var IsFoodAdmin = require('../isFoodAdmin/IsFoodAdmin');
var Delivered = require('../delivered/Delivered');
var ListCard = require('../listCard/ListCard');


var CardPin = require('../cardPin/CardPin');
var User = require('../user/User');
var IsVendor = require('../isVendor/IsVendor');
var bouncer = require('./../auth/bouncer');
const cardFee = parseFloat(config.cardFee);
const Discount = parseFloat(config.Discount);
const fetch = require('node-fetch');

const anokhadomain = config.anokhadomain;

var cardlist = fs.readFileSync(path.join(__dirname + '/../../valid/out.txt')).toString().split("\r\n");

for (var i; i < cardlist.length; i++)
    cardlist[i] = cardlist[i].trim();


// API GOES HERE
router.get('/', function (req, res) {
    res.status(200).send('Card API Works');
});

// MAIL FUNCTION 



const registermsg = pug.compileFile(path.join(__dirname, '../../views/register.pug'));

const thakyoupug = pug.compileFile(path.join(__dirname, '../../views/thankyou.pug'));


function generate_register_message(cardNo, pin, name, id) {
    return registermsg({ cardNo: cardNo, pin: pin, name: name, anokhaID: id });
}

function generate_thank_message(cardNo, amount, cardFee, anokhaID, name) {
    return thakyoupug({ cardNo: cardNo, amount: amount, name: name, anokhaID: anokhaID, cardFee: cardFee });
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

// ADD MONEY API

async function addmoney(cardNo, pin, amount, adminUser) {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: cardNo });

        if (cardPIN) {
            if (cardPIN.pin === pin) {

                var user_ = await CardDetails.findOne({ cardNo: cardNo });

                const newTransaction = {
                    fromCardNo: '0',
                    toCardNo: cardNo,
                    amount: parseFloat(amount),
                    transactionID: TID,
                }

                const newTransactionDetails = {
                    transactionID: TID,
                    orderDetails: "Amount added by userID : " + adminUser + " to " + cardNo
                }

                const newTransactionSummary = {
                    transactionID: TID,
                    cardNo: cardNo,
                    phoneNumber: user_.phoneNumber,
                    amount: parseFloat(amount)
                }

                const A = await CardBalance.findOneAndUpdate({ cardNo: cardNo }, { $inc: { balance: parseFloat(amount) } }, opts);

                const B = await Transaction.create([newTransaction], opts);

                const C = await TransactionDetails.create([newTransactionDetails], opts);

                const D = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: parseFloat(amount) } }, opts);

                const E = await TransactionSummary.create([newTransactionSummary], opts);

                await session.commitTransaction();
                await session.endSession();
                return { message: 'Money Added Successfully.\nUpdated Balance : ' + A.balance + ' Rs.', balance: A.balance };
            } else {
                throw new Error('Invalid Pin');
            }

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}

router.post('/addmoney', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var cardNo = req.body.cardNo;
        var pin = req.body.pin;
        var amount = req.body.amount;
        var adminUser = req.username;
        addmoney(cardNo, pin, amount, adminUser).then((message) => {
            return res.status(200).send(message);
        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});


async function addmoneyID(cardNo, pin, amount, adminUser) {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: cardNo });

        if (cardPIN) {
            if (cardPIN.pin === pin) {

                var user_ = await CardDetails.findOne({ cardNo: cardNo });

                const newTransaction = {
                    fromCardNo: '0',
                    toCardNo: cardNo,
                    amount: parseFloat(amount),
                    transactionID: TID,
                }

                const newTransactionDetails = {
                    transactionID: TID,
                    orderDetails: "Amount added by userID : " + adminUser + " to " + cardNo
                }

                const newTransactionSummary = {
                    transactionID: TID,
                    cardNo: cardNo,
                    phoneNumber: user_.phoneNumber,
                    amount: parseFloat(amount)
                }


                const A = await CardBalance.findOneAndUpdate({ cardNo: cardNo }, { $inc: { balance: parseFloat(amount) } }, opts);

                const B = await Transaction.create([newTransaction], opts);

                const C = await TransactionDetails.create([newTransactionDetails], opts);

                const D = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: parseFloat(amount) } }, opts);

                const E = await TransactionSummary.create([newTransactionSummary], opts);

                const F = await IDToCard.findOne({ cardNo: cardNo });

                const reqA = await fetch(anokhadomain + '/api/wallet/add-transaction', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ anokha_id: F.idCard, tid: TID, vendor_name: 'Amrita Wallet', details: newTransactionDetails.orderDetails, amount: parseFloat(amount), transacted_at: Date(Date.now()).toString().split('GMT')[0].trim() })
                });

                const conA = await reqA.json();

                if (conA['success'] != true) {
                    // console.log(conA['success']);
                    throw new Error("Anokha Server : " + conA['error']);
                }

                await session.commitTransaction();
                await session.endSession();
                return { message: 'Money Added Successfully.\nUpdated Balance : ' + A.balance + ' Rs.', balance: A.balance };
            } else {
                throw new Error('Invalid Pin');
            }

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}

router.post('/addmoneyID', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var cardNo = req.body.cardNo;
        var pin = req.body.pin;
        var amount = req.body.amount;
        var adminUser = req.username;
        addmoneyID(cardNo, pin, amount, adminUser).then((message) => {
            return res.status(200).send(message);
        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});


// REMOVE MONEY API

async function removemoney(cardNo, pin, adminUser, condition) {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session };
        const opts_ = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const TID_ = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: cardNo });

        if (cardPIN) {
            if (cardPIN.pin === pin) {

                const cardB = await CardBalance.findOne({ cardNo: cardNo });

                if (cardB) {

                    var user_ = await CardDetails.findOne({ cardNo: cardNo });

                    const newTransaction = {
                        fromCardNo: cardNo,
                        toCardNo: '1',
                        amount: parseFloat(cardB.balance),
                        transactionID: TID
                    }

                    const newTransactionDetails = {
                        transactionID: TID,
                        orderDetails: "Amount removed by userID : " + adminUser + " for " + cardNo
                    }

                    const TransactionForCardFee = {
                        fromCardNo: cardNo,
                        toCardNo: '1',
                        amount: cardFee,
                        transactionID: TID_
                    }

                    const TransactionDetailsForCardFee = {
                        transactionID: TID_,
                        orderDetails: "Amount removed and card fee given back by userID : " + adminUser + " for " + cardNo
                    }

                    const newTransactionSummary = {
                        amount: -parseFloat(cardB.balance),
                        transactionID: TID,
                        cardNo: cardNo,
                        phoneNumber: user_.phoneNumber
                    }


                    var totalAmount = newTransaction.amount;
                    if (condition === 'true')
                        totalAmount += cardFee;

                    const Z = await UsernameHardCash.findOne({ username: adminUser });

                    if (Z.amount < totalAmount)
                        throw new Error('You don\'t have enough balance to return the card');

                    const A = await CardBalance.findOneAndRemove({ cardNo: cardNo }, opts);

                    const B = await Transaction.create([newTransaction], opts);

                    const C = await TransactionDetails.create([newTransactionDetails], opts);

                    if (condition === 'true') {
                        const D = await Transaction.create([TransactionForCardFee], opts);

                        const E = await TransactionDetails.create([TransactionDetailsForCardFee], opts);
                    }


                    const K = await TransactionSummary.create([newTransactionSummary], opts);

                    const F = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: -totalAmount } }, opts_);

                    const G = await CardPin.findOneAndRemove({ cardNo: cardNo }, opts);

                    const H = await IDToCard.findOneAndRemove({ cardNo: cardNo }, opts);

                    const I = await UsernameToCard.findOneAndRemove({ cardNo: cardNo }, opts);

                    const J = await CardDetails.findOneAndRemove({ cardNo: cardNo }, opts);

                    await session.commitTransaction();
                    await session.endSession();
                    return { message: 'success', amount: totalAmount, email: user_.email };

                } else {
                    throw new Error('No Such Card Exists / Check Card Number');
                }
            } else {
                throw new Error('Invalid Pin');
            }

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}


router.post('/removemoney', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var cardNo = req.body.cardNo;
        var pin = req.body.pin;
        var condition = req.body.condition;
        var adminUser = req.username;

        removemoney(cardNo, pin, adminUser, condition).then((message) => {

            send_mail(message.email, 'Thank You', generate_thank_message(cardNo, message.amount - cardFee)).then((msg) => {
                return res.status(200).send(message);
            }).catch((err) => {
                //console.log(err);
                return res.status(417).send({ message: message, warning: 'Mail was not sent' });
            });

        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});

//Remove Money using ID

async function removemoneyID(cardNo, pin, adminUser, condition) {

    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        const opts = { session };
        const opts_ = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const TID_ = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: cardNo });

        if (cardPIN) {
            const check = await IDToCard.findOne({ cardNo: cardNo });
            if (!check)
                throw new Error('Cannot Return this card. Probably a Vendor Card');
            if (cardPIN.pin === pin) {

                const cardB = await CardBalance.findOne({ cardNo: cardNo });

                if (cardB) {

                    var user_ = await CardDetails.findOne({ cardNo: cardNo });

                    var id_ = await IDToCard.findOne({ cardNo: cardNo });

                    const newTransaction = {
                        fromCardNo: cardNo,
                        toCardNo: '1',
                        amount: parseFloat(cardB.balance),
                        transactionID: TID
                    }

                    const newTransactionDetails = {
                        transactionID: TID,
                        orderDetails: "Amount removed by userID : " + adminUser + " for " + cardNo
                    }

                    const TransactionForCardFee = {
                        fromCardNo: cardNo,
                        toCardNo: '1',
                        amount: cardFee,
                        transactionID: TID_
                    }

                    const TransactionDetailsForCardFee = {
                        transactionID: TID_,
                        orderDetails: "Amount removed and card fee given back by userID : " + adminUser + " for " + cardNo
                    }

                    const newTransactionSummary = {
                        amount: -parseFloat(cardB.balance),
                        transactionID: TID,
                        cardNo: cardNo,
                        phoneNumber: user_.phoneNumber
                    }


                    var totalAmount = newTransaction.amount;
                    if (condition === 'true')
                        totalAmount += cardFee;

                    const Z = await UsernameHardCash.findOne({ username: adminUser });

                    if (Z.amount < totalAmount)
                        throw new Error('You don\'t have enough balance to return the card');

                    const A = await CardBalance.findOneAndRemove({ cardNo: cardNo }, opts);

                    const B = await Transaction.create([newTransaction], opts);

                    const C = await TransactionDetails.create([newTransactionDetails], opts);

                    if (condition === 'true') {
                        const D = await Transaction.create([TransactionForCardFee], opts);

                        const E = await TransactionDetails.create([TransactionDetailsForCardFee], opts);
                    }


                    const K = await TransactionSummary.create([newTransactionSummary], opts);

                    const F = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: -totalAmount } }, opts_);

                    const G = await CardPin.findOneAndRemove({ cardNo: cardNo }, opts);

                    const I = await UsernameToCard.findOneAndRemove({ cardNo: cardNo }, opts);

                    const J = await CardDetails.findOneAndRemove({ cardNo: cardNo }, opts);

                    const H = await IDToCard.findOneAndRemove({ cardNo: cardNo }, opts);

                    const F1 = await IDToCard.findOne({ cardNo: cardNo });

                    const reqA = await fetch(anokhadomain + '/api/wallet/' + F1.idCard, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });

                    const conA = await reqA.json();

                    console.log(conA);

                    if (conA['success'] != true) {
                        // console.log(conA['error']);
                        throw new Error("Anokha Server : " + conA['error']);
                    }

                    await session.commitTransaction();
                    await session.endSession();
                    return { message: 'success', amount: totalAmount, email: user_.email, name: user_.name, id: id_.idCard };

                } else {
                    throw new Error('No Such Card Exists / Check Card Number');
                }
            } else {
                throw new Error('Invalid Pin');
            }

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}


router.post('/removemoneyID', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var cardNo = req.body.cardNo;
        var pin = req.body.pin;
        var condition = req.body.condition;
        var adminUser = req.username;

        removemoneyID(cardNo, pin, adminUser, condition).then((message) => {

            send_mail(message.email, 'Thank You', generate_thank_message(cardNo, message.amount - cardFee, cardFee, message.id, message.name)).then((msg) => {
                return res.status(200).send(message);
            }).catch((err) => {
                //console.log(err);
                return res.status(417).send({ message: message, warning: 'Mail was not sent' });
            });

        }).catch((err) => {
            console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});


// REGISTER CARD - USER API 

async function register(cardNo, pin, email, phoneNumber, amount, adminUser, name) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const TID_ = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const card_ = await CardBalance.findOne({ cardNo: cardNo });

        if (!card_) {
            const amountIN = amount - cardFee;

            if (amountIN < 0)
                throw new Error('Amount less than card fee : card fee is RS.' + cardFee.toString());

            const cardDetails = {
                cardNo: cardNo,
                email: email,
                phoneNumber: phoneNumber,
                name: name
            };

            const carPIN = {
                cardNo: cardNo,
                pin: pin
            };

            const cardBal = {
                cardNo: cardNo,
                balance: amountIN
            }

            const TransactionIssue = {
                fromCardNo: '1',
                toCardNo: cardNo,
                amount: cardFee,
                transactionID: TID
            }

            const TransactionIssueDetails = {
                transactionID: TID,
                orderDetails: "Card Issued and card fee collected by userID : " + adminUser + " for " + cardNo
            }

            const TransactionAddMoney = {
                fromCardNo: '0',
                toCardNo: cardNo,
                amount: amountIN,
                transactionID: TID_
            }

            const TransactionAddMoneyDetails = {
                transactionID: TID_,
                orderDetails: "Amount added by userID : " + adminUser + " to " + cardNo
            }

            const newTransactionSummary = {
                amount: amountIN,
                transactionID: TID_,
                cardNo: cardNo,
                phoneNumber: phoneNumber
            }

            const A = await CardDetails.create([cardDetails], opts);

            const J = await AllCardDetails.create([cardDetails], opts);

            const B = await CardPin.create([carPIN], opts);

            const C = await CardBalance.create([cardBal], opts);

            const D = await Transaction.create([TransactionIssue], opts);

            const E = await TransactionDetails.create([TransactionIssueDetails], opts);

            const F = await Transaction.create([TransactionAddMoney], opts);

            const G = await TransactionDetails.create([TransactionAddMoneyDetails], opts);

            const I = await TransactionSummary.create([newTransactionSummary], opts);

            const H = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: amount } }, opts);

            await session.commitTransaction();
            await session.endSession();
            return { message: 'success', cardNo: cardNo, amount: amountIN };

        } else {
            throw new Error('Card Number Already Exists');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}

router.post('/register', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var cardNo = req.body.cardNo;
        var pin = req.body.pin;
        var email = req.body.email;
        var amount = req.body.amount;
        var phoneNumber = req.body.phoneNumber;
        var adminUser = req.username;
        var name = req.body.name;

        register(cardNo, pin, email, phoneNumber, amount, adminUser, name).then((message) => {
            send_mail(email, 'Registration Successful', generate_register_message(cardNo, pin, email)).then((msg) => {
                return res.status(200).send(message);
            }).catch((err) => {
                //console.log(err);
                return res.status(417).send({ message: message, warning: 'Mail was not sent' });
            });

        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});

// REGISTER CARD USING ID 

async function registerID(cardNo, pin, email, phoneNumber, amount, adminUser, name, id) {

    const U = await ListCard.findOne({ cardNo: cardNo });

    if (!U)
        throw new Error('Invalid card number');

    const L = await IDToCard.findOne({ idCard: id });
    if (L)
        throw new Error("Already registered.Please return the previous card.");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const TID_ = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const card_ = await CardBalance.findOne({ cardNo: cardNo });

        if (!card_) {
            const amountIN = amount - cardFee;

            if (amountIN < 0)
                throw new Error('Amount less than card fee : card fee is RS.' + cardFee.toString());

            const cardDetails = {
                cardNo: cardNo,
                email: email,
                phoneNumber: phoneNumber,
                name: name
            };

            const carPIN = {
                cardNo: cardNo,
                pin: pin
            };

            const cardBal = {
                cardNo: cardNo,
                balance: amountIN
            }

            const TransactionIssue = {
                fromCardNo: '1',
                toCardNo: cardNo,
                amount: cardFee,
                transactionID: TID
            }

            const TransactionIssueDetails = {
                transactionID: TID,
                orderDetails: "Card Issued and card fee collected by userID : " + adminUser + " for " + cardNo
            }

            const TransactionAddMoney = {
                fromCardNo: '0',
                toCardNo: cardNo,
                amount: amountIN,
                transactionID: TID_
            }

            const TransactionAddMoneyDetails = {
                transactionID: TID_,
                orderDetails: "Amount added by userID : " + adminUser + " to " + cardNo
            }

            const newTransactionSummary = {
                amount: amountIN,
                transactionID: TID_,
                cardNo: cardNo,
                phoneNumber: phoneNumber
            }


            const K = await IDToCard.create([{ idCard: id, cardNo: cardNo }], opts);

            const A = await CardDetails.create([cardDetails], opts);

            const J = await AllCardDetails.create([cardDetails], opts);

            const B = await CardPin.create([carPIN], opts);

            const C = await CardBalance.create([cardBal], opts);

            const D = await Transaction.create([TransactionIssue], opts);

            const E = await TransactionDetails.create([TransactionIssueDetails], opts);

            const F = await Transaction.create([TransactionAddMoney], opts);

            const G = await TransactionDetails.create([TransactionAddMoneyDetails], opts);

            const I = await TransactionSummary.create([newTransactionSummary], opts);

            const H = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: amount } }, opts);


            const reqA = await fetch(anokhadomain + '/api/wallet/add-user', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    anokha_id: id, balance: amountIN, tid: TID_, vendor_name: 'Amrita Wallet', details: TransactionAddMoneyDetails.orderDetails, amount: amountIN, transacted_at: Date(Date.now()).toString().split('GMT')[0].trim(),
                    amountFirst: cardFee, detailsFirst: 'Security Deposit', tidFirst: TID, card_no: cardNo
                })
            });
            // console.log(reqA);
            const conA = await reqA.json();
            // console.log(conA);
            if (conA['success'] != true) {
                // console.log(conA['success']);
                throw new Error("Anokha Server : " + conA['error']);
            }
            await session.commitTransaction();
            await session.endSession();
            return { message: 'success', cardNo: cardNo, amount: amountIN };

        } else {
            throw new Error('Card Number Already Exists');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}

router.post('/registerID', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var cardNo = req.body.cardNo;
        var pin = req.body.pin;
        var email = req.body.email;
        var amount = req.body.amount;
        var phoneNumber = req.body.phoneNumber;
        var adminUser = req.username;
        var name = req.body.name;
        var ID = req.body.id;

        console.log(generate_register_message(cardNo, pin, name, ID));

        registerID(cardNo, pin, email, phoneNumber, amount, adminUser, name, ID).then((message) => {
            send_mail(email, 'Registration Successfull', generate_register_message(cardNo, pin, name, ID)).then((msg) => {
                return res.status(200).send(message);
            }).catch((err) => {
                // console.log(err);
                return res.status(417).send({ message: message, warning: 'Mail was not sent' });
            });

        }).catch((err) => {
            // console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});


// TRANSFER MONEY API 

async function transfer(fromCardNo, toCardNo, pin, amount, orderDetails) {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: fromCardNo });
        const toCardDoc = await CardBalance.findOne({ cardNo: toCardNo });

        if (fromCardNo === toCardNo) {
            throw new Error('From and to card are same.');
        }

        if (cardPIN && toCardDoc) {
            if (cardPIN.pin === pin) {

                const value = parseFloat(amount);

                var fromUser = await CardDetails.findOne({ cardNo: fromCardNo });
                var toUser = await CardDetails.findOne({ cardNo: toCardNo });

                const newTransaction = {
                    fromCardNo: fromCardNo,
                    toCardNo: toCardNo,
                    amount: value,
                    transactionID: TID
                }

                const newTransactionDetails = {
                    transactionID: TID,
                    orderDetails: orderDetails
                }

                const TransactionSummaryA = {
                    amount: -value,
                    transactionID: TID,
                    cardNo: fromCardNo,
                    phoneNumber: fromUser.phoneNumber
                }

                const TransactionSummaryB = {
                    amount: value,
                    transactionID: TID,
                    cardNo: toCardNo,
                    phoneNumber: toUser.phoneNumber
                }
                const A = await CardBalance.findOneAndUpdate({ cardNo: fromCardNo }, { $inc: { balance: -value } }, opts);

                if (A.balance < 0) {
                    throw new Error("Insufficient Balance");
                }

                const B = await CardBalance.findOneAndUpdate({ cardNo: toCardNo }, { $inc: { balance: value } }, opts);

                const C = await Transaction.create([newTransaction], opts);

                const D = await TransactionDetails.create([newTransactionDetails], opts);

                const E = await TransactionSummary.create([TransactionSummaryA, TransactionSummaryB], opts);

                await session.commitTransaction();
                await session.endSession();
                return { message: 'Payment Successful.\nUpdated Balance : ' + A.balance + ' Rs.', TID: TID };
            } else {
                throw new Error('Invalid Pin');
            }

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}


router.post('/transfer', bouncer.block, function (req, res) {

    var fromCardNo = req.body.fromCardNo;
    var pin = req.body.pin;
    var toCardNo = req.body.toCardNo;
    var amount = req.body.amount;
    var orderDetails = req.body.orderDetails;

    transfer(fromCardNo, toCardNo, pin, amount, orderDetails).then((message) => {
        bouncer.reset(req);
        return res.status(200).send(message);
    }).catch((err) => {
        return res.status(400).send({ message: err.toString() })
    });


});

//Transfer ID Version

async function transferID(fromCardNo, toCardNo, pin, amount, orderDetails) {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: fromCardNo });
        const toCardDoc = await CardBalance.findOne({ cardNo: toCardNo });

        if (fromCardNo === toCardNo) {
            throw new Error('From and to card are same.');
        }

        if (cardPIN && toCardDoc) {
            if (cardPIN.pin === pin) {

                const value = parseFloat(amount);

                var fromUser = await CardDetails.findOne({ cardNo: fromCardNo });
                var toUser = await CardDetails.findOne({ cardNo: toCardNo });

                var fromaid = await IDToCard.findOne({ cardNo: fromCardNo });
                var toaid = await IDToCard.findOne({ cardNo: toCardNo });

                var anokharoutechoice;

                if (fromaid && toaid)
                    anokharoutechoice = 0;
                else
                    anokharoutechoice = 1;

                const newTransaction = {
                    fromCardNo: fromCardNo,
                    toCardNo: toCardNo,
                    amount: value,
                    transactionID: TID
                }

                const newTransactionDetails = {
                    transactionID: TID,
                    orderDetails: orderDetails
                }

                const TransactionSummaryA = {
                    amount: -value,
                    transactionID: TID,
                    cardNo: fromCardNo,
                    phoneNumber: fromUser.phoneNumber
                }

                const TransactionSummaryB = {
                    amount: value,
                    transactionID: TID,
                    cardNo: toCardNo,
                    phoneNumber: toUser.phoneNumber
                }
                const A = await CardBalance.findOneAndUpdate({ cardNo: fromCardNo }, { $inc: { balance: -value } }, opts);

                if (A.balance < 0) {
                    throw new Error("Insufficient Balance");
                }

                const B = await CardBalance.findOneAndUpdate({ cardNo: toCardNo }, { $inc: { balance: value } }, opts);

                const C = await Transaction.create([newTransaction], opts);

                const D = await TransactionDetails.create([newTransactionDetails], opts);

                const E = await TransactionSummary.create([TransactionSummaryA, TransactionSummaryB], opts);

                if (anokharoutechoice == 1) {
                    var amountcopy = value;
                    var idcopy;
                    var vendorname;
                    if (fromaid) {
                        amountcopy = parseFloat(-value);
                        idcopy = fromaid.idCard;
                        vendorname = await UsernameToCard.findOne({ cardNo: toCardNo });
                        const newDelivery = {
                            fromCardNo: fromCardNo,
                            toCardNo: toCardNo,
                            amount: value,
                            transactionID: TID,
                            orderDetails: orderDetails,
                            status: false
                        }

                        const F = await Delivered.create([newDelivery], opts);
                    }
                    else {
                        idcopy = toaid.idCard;
                        vendorname = await UsernameToCard.findOne({ cardNo: fromCardNo });
                    }
                    // console.log(idcopy);



                    const reqA = await fetch(anokhadomain + '/api/wallet/add-transaction', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ anokha_id: idcopy, tid: TID, vendor_name: vendorname.username, details: newTransactionDetails.orderDetails, amount: amountcopy, transacted_at: Date(Date.now()).toString().split('GMT')[0].trim() })
                    });

                    const conA = await reqA.json();

                    if (conA['success'] != true) {
                        // console.log(conA['success']);
                        throw new Error("Anokha Server : " + conA['error']);
                    }
                }
                else {

                    throw new Error('You can transfer only to a vendor.');

                    const reqB = await fetch(anokhadomain + '/api/wallet/transfer', {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ from_anokha_id: fromaid.idCard, to_anokha_id: toaid.idCard, tid: TID, details: newTransactionDetails.orderDetails, amount: value, transacted_at: Date(Date.now()).toString().split('GMT')[0].trim() })
                    });

                    const conB = await reqB.json();

                    if (conB['success'] != true) {
                        // console.log(conA['success']);
                        throw new Error(conB['error']);
                    }

                }

                await session.commitTransaction();
                await session.endSession();
                return { message: 'Payment Successful.\nUpdated Balance : ' + A.balance + ' Rs.', TID: TID , username : fromUser.name };
            } else {
                throw new Error('Invalid Pin');
            }

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}


router.post('/transferID', bouncer.block, function (req, res) {

    var fromCardNo = req.body.fromCardNo;
    var pin = req.body.pin;
    var toCardNo = req.body.toCardNo;
    var amount = req.body.amount;
    var orderDetails = req.body.orderDetails;

    transferID(fromCardNo, toCardNo, pin, amount, orderDetails).then((message) => {
        bouncer.reset(req);
        return res.status(200).send(message);
    }).catch((err) => {
        return res.status(400).send({ message: err.toString() })
    });


});

// USERNAME TO CARD API

router.get('/usercard/:username', VerifyToken, function (req, res) {

    var username = req.params.username;

    if (username === req.username) {

        UsernameToCard.findOne({ username: username }, function (err, userCard) {
            if (userCard) {
                return res.status(200).send({ message: userCard.cardNo });
            } else {
                return res.status(401).send({ message: 'Cannot be found' });
            }

        });

    } else {
        return res.status(401).send({ message: 'Cannot be given' });
    }
});

// TRANSACTION LIST API

async function transactionList(cardNo, pin) {
    const card = await CardPin.findOne({ cardNo: cardNo });
    if (card) {
        if (pin === card.pin) {
            const cardDet = await CardDetails.findOne({ cardNo: cardNo });
            const TList = await TransactionSummary.find({ cardNo: cardNo, phoneNumber: cardDet.phoneNumber });
            return { list: TList };
        } else {
            throw new Error('Invalid Pin');
        }
    } else {
        throw new Error('No Such Card Exists / Check Card Number');
    }
}


router.post('/tlist', function (req, res) {

    var cardNo = req.body.cardNo;
    var pin = req.body.pin;

    transactionList(cardNo, pin).then((message) => {
        return res.status(200).send(message);
    }).catch((err) => {
        //console.log(err);
        return res.status(400).send({ message: err.toString() })
    });
});

// TRANSACTION LIST API - PHONE

async function transactionListPhone(cardNo, phoneNumber) {
    //console.log(cardNo);
    //console.log(phoneNumber);

    const TList = await TransactionSummary.find({ cardNo: cardNo, phoneNumber: phoneNumber });
    //console.log(TList);
    if (TList.length > 0)
        return { list: TList };
    else
        throw new Error('No such card Exists');

}


router.post('/tlistphone', VerifyToken, function (req, res) {

    if (req.superuser === 'true') {
        var cardNo = req.body.cardNo;
        var phoneNumber = req.body.phoneNumber;

        transactionListPhone(cardNo, phoneNumber).then((message) => {
            return res.status(200).send(message);
        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });
    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as superuser.' });
    }


});

// Register With Discount

async function registerVendor(adminUser, shopname, name, email, phone, username, password, pin, cardNo, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {

        const opts = { session, new: true };
        const TID = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const TID_ = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const card_ = await CardBalance.findOne({ cardNo: cardNo });
        const cardFeeT = cardFee - Discount;
        const Z = await UsernameToCard.findOne({ username: username });
        if (Z)
            throw new Error('Username already linked to a card. Please contact Wallet Team to change');
        if (!card_) {
            const amountIN = amount - cardFeeT;
            if (amountIN < 0)
                throw new Error('Amount less than card fee : card fee is RS.' + cardFeeT.toString());

            const Y = await UsernameToCard.findOne({ cardNo: cardNo });
            if (Y)
                throw new Error(`Card already linked to a vendor ${I.username}`);
            const cardDetails = {
                cardNo: cardNo,
                email: email,
                phoneNumber: phone,
                name: name
            };

            const carPIN = {
                cardNo: cardNo,
                pin: pin
            };

            const cardBal = {
                cardNo: cardNo,
                balance: parseFloat(amountIN)
            }

            const TransactionIssue = {
                fromCardNo: '1',
                toCardNo: cardNo,
                amount: parseFloat(cardFeeT),
                transactionID: TID
            }

            const TransactionIssueDetails = {
                transactionID: TID,
                orderDetails: "Card Issued and card fee collected by userID : " + adminUser + " for " + cardNo
            }

            const TransactionAddMoney = {
                fromCardNo: '0',
                toCardNo: cardNo,
                amount: parseFloat(amountIN),
                transactionID: TID_
            }

            const TransactionAddMoneyDetails = {
                transactionID: TID_,
                orderDetails: "Amount added by userID : " + adminUser + " to " + cardNo
            }

            const newTransactionSummary = {
                amount: amountIN,
                transactionID: TID_,
                cardNo: cardNo,
                phoneNumber: phone
            }

            var hashedPassword = password;
            var newUser = {
                name: shopname,
                username: username,
                password: hashedPassword,
                phoneNumber: phone
            }

            var ret3 = await User.create([newUser], opts);
            const newisAdmin = {
                username: username,
                isAdmin: false
            }
            ret3 = await IsAdmin.create([newisAdmin], opts);

            var newisSuperuser = {
                username: username,
                isSuperuser: false
            }
            ret3 = await IsSuperuser.create([newisSuperuser], opts);


            var newisVendor = {
                username: username,
                isVendor: true
            };
            ret3 = await IsVendor.create([newisVendor], opts);


            var newisFinanceAdmin = {
                username: username,
                isFinanceadmin: false
            }
            ret3 = await IsFinanceAdmin.create([newisFinanceAdmin], opts);

            var newisFoodAdmin = {
                username: username,
                isFoodAdmin: false
            }
            ret3 = await IsFoodAdmin.create([newisFoodAdmin], opts);

            const A = await CardDetails.create([cardDetails], opts);

            const J = await AllCardDetails.create([cardDetails], opts);

            const B = await CardPin.create([carPIN], opts);

            const C = await CardBalance.create([cardBal], opts);

            const D = await Transaction.create([TransactionIssue], opts);

            const E = await TransactionDetails.create([TransactionIssueDetails], opts);

            const F = await Transaction.create([TransactionAddMoney], opts);

            const G = await TransactionDetails.create([TransactionAddMoneyDetails], opts);

            const I = await TransactionSummary.create([newTransactionSummary], opts);

            const H = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: parseFloat(amount) } }, opts);


            var newUsernameToCard = {
                username: username,
                cardNo: cardNo
            }
            var K = await UsernameToCard.create([newUsernameToCard], opts);
            await session.commitTransaction();
            await session.endSession();
            return { message: 'Vendor registered and linked to the card', cardNo: cardNo, amount: amountIN };

        } else {
            throw new Error('Card Number Already Exists');
        }

    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }

}



router.post('/registerwithdiscount', VerifyToken, function (req, res) {
    if (req.admin == 'true') {
        var obj = req.body;
        if (obj.amount) {
            registerVendor(req.username, obj.shopname, obj.name, obj.email, obj.phone, obj.user, obj.password, obj.pin, obj.cardNo, obj.amount).then((msg) => {
                res.status(200).send(msg);
            }).catch((err) => {
                res.status(500).send({ message: err.toString() });
            });
        }
        else {
            res.status(417).send({ message: "Not implementated yet!" });
        }
    }
    else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }

});




// CARD BALANCE WITHOUT PIN API - only for app.

async function getbalancewithoutpin(cardNo) {
    const balance_ = await CardBalance.findOne({ cardNo: cardNo });
    if (balance_) {
        return { balance: balance_.balance }
    } else {
        throw new Error('No Such Card Exists / Check Card Number');
    }
}

router.post('/balancewithoutpin', VerifyToken, function (req, res) {
    var cardNo = req.body.cardNo;
    getbalancewithoutpin(cardNo).then((message) => {
        return res.status(200).send(message);
    }).catch((err) => {
        //console.log(err);
        return res.status(400).send({ message: err.toString() })
    });
});


// CARD BALANCE API

async function getbalance(cardNo, pin) {
    const card = await CardPin.findOne({ cardNo: cardNo });
    if (card) {
        if (pin === card.pin) {
            const balance_ = await CardBalance.findOne({ cardNo: cardNo });
            return { balance: balance_.balance }
        } else {
            throw new Error('Invalid Pin');
        }
    } else {
        throw new Error('No Such Card Exists / Check Card Number');
    }
}

router.post('/balance', bouncer.block, function (req, res) {

    // console.log(req.sanitize(req.body.cardNo));
    // req.body = req.sanitize(req.body);
    var cardNo = req.sanitize(req.body.cardNo);
    // console.log(cardNo);
    var pin = req.body.pin;

    getbalance(cardNo, pin).then((message) => {
        bouncer.reset(req);
        return res.status(200).send(message);
    }).catch((err) => {
        // console.log(err);
        return res.status(400).send({ message: err.toString() })
    });
});

// LINK ID TO CARD API

async function link(ID, cardNo, pin) {
    const card = await CardPin.findOne({ cardNo: cardNo });
    if (card) {
        if (pin === card.pin) {
            const linking = await IDToCard.create({ idCard: ID, cardNo: cardNo });
            return { message: 'linking done', result: linking };
        } else {
            throw new Error('Invalid Pin');
        }
    } else {
        throw new Error('No Such Card Exists / Check Card Number');
    }
}


router.post('/link', function (req, res) {

    var cardNo = req.body.cardNo;
    var pin = req.body.pin;
    var ID = req.body.ID;

    link(ID, cardNo, pin).then((message) => {
        return res.status(200).send(message);
    }).catch((err) => {
        //console.log(err);
        return res.status(400).send({ message: err.toString() })
    });
});

// ID TO TRANSACTION LIST API

async function IDToTList_(ID) {
    const IDToCard_ = await IDToCard.findOne({ idCard: ID });
    if (IDToCard_) {
        const cardDet = await CardDetails.findOne({ cardNo: IDToCard_.cardNo });
        const TList = await TransactionSummary.find({ cardNo: IDToCard_.cardNo, phoneNumber: cardDet.phoneNumber });
        return { list: TList };

    } else {
        throw new Error('No Card Associated with ID');
    }
}


router.post('/idtlist', function (req, res) {

    var ID = req.body.ID;

    IDToTList_(ID).then((message) => {
        return res.status(200).send(message);
    }).catch((err) => {
        //console.log(err);
        return res.status(400).send({ message: err.toString() })
    });
});

// ID TO BALANCE API

async function IDToTList(ID) {
    const IDToCard_ = await IDToCard.findOne({ idCard: ID });
    if (IDToCard_) {

        const card = await CardBalance.findOne({ cardNo: IDToCard_.cardNo });
        return { balance: card.balance };

    } else {
        throw new Error('No Card Associated with ID');
    }
}


router.post('/idbalance', function (req, res) {

    var ID = req.body.ID;

    IDToTList(ID).then((message) => {
        return res.status(200).send(message);
    }).catch((err) => {
        //console.log(err);
        return res.status(400).send({ message: err.toString() })
    });
});

// MY CARD

async function me(username) {
    const A = await UsernameToCard.findOne({ username: username });
    if (A)
        return { cardNo: A.cardNo };
    else
        throw new Error('No card exists');
}

router.get('/me', VerifyToken, function (req, res) {
    me(req.username).then((message) => {
        return res.status(200).send(message);
    }).catch((err) => {
        //console.log(err);
        return res.status(400).send({ message: err.toString() })
    });
})


async function getReturnAmount(cardNo, pin, adminUser, condition) {


    try {

        const cardPIN = await CardPin.findOne({ cardNo: cardNo });

        if (cardPIN) {
            if (cardPIN.pin === pin) {
                const check = await IDToCard.findOne({ cardNo: cardNo });
                if (!check)
                    throw new Error('Cannot Return this card. Probably a Vendor Card');

                const cardB = await CardBalance.findOne({ cardNo: cardNo });

                if (cardB) {

                    var user_ = await CardDetails.findOne({ cardNo: cardNo });

                    var totalAmount = cardB.balance;

                    //console.log(cardB);

                    if (condition === 'true')
                        totalAmount += cardFee;

                    return { message: 'success', amount: totalAmount, email: user_.email };

                } else {
                    throw new Error('No Such Card Exists / Check Card Number');
                }
            } else {
                throw new Error('Invalid Pin');
            }

        } else {
            throw new Error('No Such Card Exists / Check Card Number');
        }

    } catch (error) {
        throw error;
    }
}


router.post('/getBalanceAmount', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var cardNo = req.body.cardNo;
        var pin = req.body.pin;
        var condition = req.body.condition;
        var adminUser = req.username;

        getReturnAmount(cardNo, pin, adminUser, condition).then((message) => {
            res.status(200).send(message);

        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});

router.get('/sumbalance', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        CardBalance.aggregate([{
            $group: {
                _id: null,
                count: {
                    $sum: 1
                },
                sum: {
                    $sum: '$balance'
                }
            }
        }], function (err, doc) {
            //console.log(doc);
            if (doc.length > 0)
                res.status(200).send({ totalAmount: doc[0].sum + doc[0].count * cardFee });
            else
                res.status(200).send({ totalAmount: 0 });
        });
    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as finance admin.' });
    }
});


// Vendor Card Balance

router.get('/vendorBalance', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        IsVendor.aggregate([{ $match: { isVendor: true } }, {
            $lookup: {
                from: 'usernametocards',
                localField: 'username',
                foreignField: 'username',
                as: 'cardDetails'
            }
        }, {
            "$unwind": "$cardDetails"
        }, {
            $lookup: {
                from: 'cardbalances',
                localField: 'cardDetails.cardNo',
                foreignField: 'cardNo',
                as: 'cardBalances'
            }
        }, {
            "$unwind": "$cardBalances"
        }, {
            $group: {
                _id: null,
                count: {
                    $sum: 1
                },
                sum: {
                    $sum: '$cardBalances.balance'
                }
            }
        }], function (err, doc) {
            if (doc.length > 0) {
                res.status(200).send(doc);
            } else {
                res.status(200).send({ totalAmount: 0 });
            }

        });
    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as finance admin.' });
    }
});

// User Card Balance

async function getUserBalance() {
    const A = await IsVendor.aggregate([{ $match: { isVendor: true } }, {
        $lookup: {
            from: 'usernametocards',
            localField: 'username',
            foreignField: 'username',
            as: 'cardDetails'
        }
    }, {
        "$unwind": "$cardDetails"
    }, {
        $lookup: {
            from: 'cardbalances',
            localField: 'cardDetails.cardNo',
            foreignField: 'cardNo',
            as: 'cardBalances'
        }
    }, {
        "$unwind": "$cardBalances"
    }, {
        $group: {
            _id: null,
            count: {
                $sum: 1
            },
            sum: {
                $sum: '$cardBalances.balance'
            }
        }
    }]);

    const B = await CardBalance.aggregate([{
        $group: {
            _id: null,
            count: {
                $sum: 1
            },
            sum: {
                $sum: '$balance'
            }
        }
    }]);
    if (A.length < 1 && B.length < 1)
        return { amount: 0 };
    if (A.length < 1)
        return { amount: B[0].sum };

    return { amount: B[0].sum - A[0].sum }

}

router.get('/userBalance', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        getUserBalance().then((message) => {
            res.status(200).send(message);

        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });
    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as finance admin.' });
    }
});

// Admin Balance

async function getAdminBalance(username) {
    const A = await UsernameHardCash.findOne({ username: username });
    return { amount: A.amount }
}

router.get('/getAdminAmount', VerifyToken, function (req, res) {
    if (req.admin === 'true') {
        var adminUser = req.username;

        getAdminBalance(adminUser).then((message) => {
            res.status(200).send(message);

        }).catch((err) => {
            //console.log(err);
            return res.status(400).send({ message: err.toString() })
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});

// take back card - transaction or not

async function takebackcard(cardNo, adminUser) {

    const session = await mongoose.startSession();
    await session.startTransaction();

    try {
        const opts = { session };
        const opts_ = { session, new: true };
        const TID_ = Number(String(Math.floor(Math.random() * 1000000)) + Date.now()).toString(36);
        const cardPIN = await CardPin.findOne({ cardNo: cardNo });
        const cardDetail = await AllCardDetails.findOne({ cardNo: cardNo });
        if (!cardPIN && cardDetail) {

            const TransactionForCardFee = {
                fromCardNo: cardNo,
                toCardNo: '1',
                amount: cardFee,
                transactionID: TID_
            }

            const TransactionDetailsForCardFee = {
                transactionID: TID_,
                orderDetails: "Amount removed and card fee given back by userID : " + adminUser + " for " + cardNo
            }

            var totalAmount = cardFee;


            const D = await Transaction.create([TransactionForCardFee], opts);

            const E = await TransactionDetails.create([TransactionDetailsForCardFee], opts);

            const F = await UsernameHardCash.findOneAndUpdate({ username: adminUser }, { $inc: { amount: -totalAmount } }, opts_);


            await session.commitTransaction();
            await session.endSession();
            return { message: 'success', amount: totalAmount };

        } else {
            throw new Error('Card Already exists go to reuturn card option / Invalid Card number');
        }


    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
}


router.post('/takebackcard', VerifyToken, function (req, res) {
    if (req.admin === 'true') {

        var cardNo = req.body.cardNo;
        var adminUser = req.username;

        takebackcard(cardNo, adminUser).then((obj) => {
            res.status(200).send(obj);
        }).catch((err) => {
            res.status(400).send({ message: err.toString() });
        });

    } else {
        return res.status(401).send({ auth: false, message: 'Failed to authenticate token as admin.' });
    }
});



router.post('/updatepin', VerifyToken, function (req, res) {
    if (req.financeadmin === 'true') {
        CardPin.updateOne({ cardNo: req.body.cardNo }, { $set: { pin: req.body.pin } }, function (err, cards) {
            if (err) return res.status(500).send({ message: "There was a problem updating the pin." });
            if (cards.n == 1) {
                res.status(200).send({ message: "Pin Updated Successfully" });
            } else {
                res.status(404).send({ message: "Card No Invalid" });
            }

        });
    }
});

async function lostcardcount()
{
    const A = await TransactionDetails.find({orderDetails: { '$regex': 'Amount removed by userID', '$options': 'i' }});
    const B = await TransactionDetails.find({orderDetails: { '$regex': 'Amount removed and card fee', '$options': 'i' }});
    return { count : A.length-B.length };
}

router.get('/getlostcardcount',function(req,res){
    lostcardcount().then((obj) => {
        res.status(200).send(obj);
    }).catch((err) => {
        res.status(400).send({ message: err.toString() });
    });
});







module.exports = router;