var mongoose = require('mongoose');
var IsAdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    }
});
mongoose.model('IsAdmin', IsAdminSchema);

module.exports = mongoose.model('IsAdmin');
