var mongoose = require('mongoose');
var InfoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    points: {
        type: Number,
        required: true,
        default: 30
    }
});
mongoose.model('info', InfoSchema);

module.exports = mongoose.model('info');
