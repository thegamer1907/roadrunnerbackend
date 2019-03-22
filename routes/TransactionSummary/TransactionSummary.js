var mongoose = require('mongoose');
const moment = require('moment-timezone');
var TransactionSummarySchema = new mongoose.Schema({
    cardNo: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    transactionID: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    amount: {
        type: Number,
        required: true
    }
});
mongoose.model('TransactionSummary', TransactionSummarySchema);

module.exports = mongoose.model('TransactionSummary');
