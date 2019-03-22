var mongoose = require('mongoose');
var CardDetailsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    cardNo: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});
mongoose.model('CardDetails', CardDetailsSchema);

module.exports = mongoose.model('CardDetails');
