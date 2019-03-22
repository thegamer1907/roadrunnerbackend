var mongoose = require('mongoose');
var UsernameToCardSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    cardNo: {
        type: String,
        required: true
    }
});
mongoose.model('UsernameToCard', UsernameToCardSchema);

module.exports = mongoose.model('UsernameToCard');
