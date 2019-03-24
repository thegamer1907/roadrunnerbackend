var mongoose = require('mongoose');
var EventsSchema = new mongoose.Schema({
    imageURL: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String
    },
    body: {
        type: String
    }
});
mongoose.model('event', EventsSchema);

module.exports = mongoose.model('event');
