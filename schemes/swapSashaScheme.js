var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var SwapSasha = new Schema({

    // Данные первого пользователя
    num: {
        type: Number,
        default: 1
    },
    user_id: {
        type: String,
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    text:  {
        type: String,
        default: ''
    },
    time: {
        type: Number,
        default: Date.now()
    },
    pay: {
        type: String,
        default: 'no'
    },
    end: {
        type: String,
        default: 'no'
    }

}, {
    versionKey: false
});

module.exports = mongoose.model('SwapSasha', SwapSasha);