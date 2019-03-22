var mongoose = require('mongoose');
var CouponWinnerSchema = new mongoose.Schema({
    cardNo: {
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
    },
    details: {
        type: String,
        required: true
    }
});
mongoose.model('CouponWinner', CouponWinnerSchema);

module.exports = mongoose.model('CouponWinner');
