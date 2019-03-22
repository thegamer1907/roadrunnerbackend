var mongoose = require('mongoose');
var IsAdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    isVendor: {
        type: Boolean,
        required: true
    }
});
mongoose.model('IsVendor', IsAdminSchema);

module.exports = mongoose.model('IsVendor');
