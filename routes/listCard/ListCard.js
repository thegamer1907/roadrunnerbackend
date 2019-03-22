var mongoose = require('mongoose');
const moment = require('moment-timezone');
var CardListSchema = new mongoose.Schema({
    cardNo: {
        type: String,
        required: true,
        unique: true
    }
});
mongoose.model('CardList', CardListSchema);

module.exports = mongoose.model('CardList');
