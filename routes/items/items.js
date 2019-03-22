var mongoose = require('mongoose');
var ItemsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    itemName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});
mongoose.model('Items', ItemsSchema);

module.exports = mongoose.model('Items');
