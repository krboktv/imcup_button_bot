var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Exchange = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: ""
    },
    currency1: {
        type: String,
        default: ""
    },
    currency2: {
        type: String,
        default: ""
    },
    amount: {
        type: Number,
        default: ""
    },
    price: {
        type: Number,
        default: ""
    },
    date: {
        type: Number,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Exchange', Exchange);