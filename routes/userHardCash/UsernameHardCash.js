var mongoose = require('mongoose');
var UsernameHardCashSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    }
});
mongoose.model('UsernameHardCash', UsernameHardCashSchema);

module.exports = mongoose.model('UsernameHardCash');
