var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Currency = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    currency: {
        
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Currency', Currency);