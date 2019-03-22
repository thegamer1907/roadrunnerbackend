var mongoose = require('mongoose');
var CardBalanceSchema = new mongoose.Schema({
    cardNo: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true
    }
});
mongoose.model('CardBalance', CardBalanceSchema);

module.exports = mongoose.model('CardBalance');
