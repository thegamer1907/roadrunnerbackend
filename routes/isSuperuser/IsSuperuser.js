var mongoose = require('mongoose');
var IsAdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    isSuperuser: {
        type: Boolean,
        required: true
    }
});
mongoose.model('IsSuperuser', IsAdminSchema);

module.exports = mongoose.model('IsSuperuser');
