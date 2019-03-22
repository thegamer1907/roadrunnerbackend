var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    photoURL: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type:String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
});
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
