var mongoose = require('mongoose');
var IsFinanceAdmin = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    isFinanceadmin: {
        type: Boolean,
        required: true
    }
});
mongoose.model('IsFinanceAdmin', IsFinanceAdmin);

module.exports = mongoose.model('IsFinanceAdmin');
