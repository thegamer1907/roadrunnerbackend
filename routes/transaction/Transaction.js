var mongoose = require('mongoose');
const moment = require('moment-timezone');
var TransactionSchema = new mongoose.Schema({
    fromCardNo: {
        type: String,
        required: true
    },
    toCardNo: {
        type: String,
        required: true
    },
    transactionID: {
        type: String,
        required: true,
        unique: true
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
mongoose.model('Transaction', TransactionSchema);

module.exports = mongoose.model('Transaction');
