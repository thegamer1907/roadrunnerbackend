var mongoose = require('mongoose');
var TransactionDetailsSchema = new mongoose.Schema({
    transactionID: {
        type: String,
        required: true,
        unique: true
    },
    orderDetails: {
        type: String,
        required: true
    }
});
mongoose.model('TransactionDetails', TransactionDetailsSchema);

module.exports = mongoose.model('TransactionDetails');
