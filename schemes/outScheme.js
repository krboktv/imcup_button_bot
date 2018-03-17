var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Out = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    currency: {
        type: String,
        default: ""
    },
    sum: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    date: {
        type: Number,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Out', Out);