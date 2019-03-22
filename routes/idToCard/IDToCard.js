var mongoose = require('mongoose');
var IDToCardSchema = new mongoose.Schema({
    idCard: {
        type: String,
        required: true,
        unique: true
    },
    cardNo: {
        type: String,
        required: true
    }
});
mongoose.model('IDToCard', IDToCardSchema);

module.exports = mongoose.model('IDToCard');
