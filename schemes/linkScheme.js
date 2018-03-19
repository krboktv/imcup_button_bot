const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Link = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    encrSeed: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Link', Link);