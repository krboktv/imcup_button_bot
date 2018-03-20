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
    // type == 1 - курс, type == 0 - футбол
    type: {
        type: Number
    },
    matchOrCurrency: {
        type: String,
        default: ''
    },
    val1: {
        type: String,
        default: ''
    },
    val2: {
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
    endTime: {
        type: String,
        default: ''
    },
    createTime: {
        type: Number,
        default: Date.now()
    },
    end: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('disput', disput);