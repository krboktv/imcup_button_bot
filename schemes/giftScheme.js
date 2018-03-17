var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Gift = new Schema({
    num: {
        type: Number,
        default: 0
    },
    user_id: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    encrSeed: {
        type: String,
        default: ""
    },
    sum: {
        type: Number,
        default: ""
    },
    currency: {
        type: String,
        default: ''
    },
    encrMessage: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Gift', Gift);