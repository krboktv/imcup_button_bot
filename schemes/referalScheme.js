var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Referal = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    referalLink: {
        type: String,
        default: ""
    },
    lastReferal1: {
        type: String,
        default: "undefined"
    },
    lastReferal2: {
        type: String,
        default: "undefined"
    },
    lastReferal3: {
        type: String,
        default: "undefined"
    },
    refCount1: {
        type: Number,
        default: 0
    },
    refCount2: {
        type: Number,
        default: 0
    },
    refCount3: {
        type: Number,
        default: 0
    },
    accepted: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Referal', Referal);