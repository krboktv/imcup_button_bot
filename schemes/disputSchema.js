var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var disput = new Schema({
    user_id1: {
        type: String
    },
    user_id2: {
        type: String,
        default: ''
    },
    num: {
        type: Number,
    },
    whatType: {
        type: String,
        default: ''
    },
    match: {
        type: String,
        default: ''
    },
    score1: {
        type: String,
        default: ''
    },
    score2: {
        type: String,
        default: ''
    },
    price: {
        type: Number
    },
    currency: {
        type: String,
        default: ''
    },
    date: {
        type: Number,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('disput', disput);