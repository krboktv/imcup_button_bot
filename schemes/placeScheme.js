const mongoose = require('mongoose');
const data = require('../data.js');
var Schema = mongoose.Schema;
var Place = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    place: {
        type: String,
        default: ""
    },
    date: {
        type: String,
        default: ''
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Place', Place);