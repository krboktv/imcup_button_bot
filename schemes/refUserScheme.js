var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var refUsers = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    ref_user_id: {
        type: String,
        default: ""
    },
    date: {
        type: Number,
        default: Date.now()
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('refUsers', refUsers);