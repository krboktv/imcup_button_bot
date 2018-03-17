var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var badTransfer = new Schema({
    user_id: {
        type: String
    },
    name: {
        type: String,
        default: ''
    },
    date: {
        type: Number,
        default: Date.now()
    },
    address: {
        type: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('badTransfer', badTransfer);