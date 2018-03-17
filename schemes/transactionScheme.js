var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Transaction = new Schema({
    currency: {
        type: String,
        default: ""
    },
    sum: {
        type: Number,
        default: ""
    },
    priceForOne: {
        type: Number,
        default: ""
    },
    address1: {
        type: String,
        default: ""
    },
    address2: {
        type: String,
        default: ""
    },
    name1: {
        type: String,
        default: ""
    },
    name2: {
        type: String,
        default: ""
    },
    time: {
        type: String,
        default: "0"
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Transaction', Transaction);