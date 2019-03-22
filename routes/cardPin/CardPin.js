var mongoose = require('mongoose');
var CardPinSchema = new mongoose.Schema({
    cardNo: {
        type: String,
        required: true,
        unique: true
    },
    pin: {
        type: String,
        required: true
    }
});
mongoose.model('CardPin', CardPinSchema);

module.exports = mongoose.model('CardPin');
