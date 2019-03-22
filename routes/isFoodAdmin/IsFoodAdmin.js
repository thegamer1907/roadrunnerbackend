var mongoose = require('mongoose');
var IsFoodAdmin = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    isFoodAdmin: {
        type: Boolean,
        required: true
    }
});
mongoose.model('IsFoodAdmin', IsFoodAdmin);

module.exports = mongoose.model('IsFoodAdmin');
