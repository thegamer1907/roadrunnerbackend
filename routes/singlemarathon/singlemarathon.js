var mongoose = require('mongoose');
var singleSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    one: {
        type: Number,
        default: 0
    },
    two: {
        type: Number,
        default: 0
    },
    three: {
        type: Number,
        default: 0
    },
    five: {
        type: Number,
        default: 0
    },
    ten: {
        type: Number,
        default: 0
    },
    fifteen: {
        type: Number,
        default: 0
    },
    twentyone: {
        type: Number,
        default: 0
    },
    fortytwo: {
        type: Number,
        default: 0
    }
});
mongoose.model('single', singleSchema);

module.exports = mongoose.model('single');
