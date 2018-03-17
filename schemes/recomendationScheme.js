var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Recomendations = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    transfer_name: {
        type: String,
        default: ""
    },
    count_to_use: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Recomendations', Recomendations);