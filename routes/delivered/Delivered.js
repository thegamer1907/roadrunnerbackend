var mongoose = require('mongoose');
var DeliveredSchema = new mongoose.Schema({
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
    },
    orderDetails: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    }
});
mongoose.model('Delivered', DeliveredSchema);

module.exports = mongoose.model('Delivered');
