var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Phone = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    number: {
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
    date: {
        type: Number,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Phone', Phone);