var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Foundations = new Schema({
    Name: {
        type: String
    },
    FoundedDate: {
        type: Number
    },
    Capital: {
        type: Number
    },
    Country: {
        type: String
    },
    Mission: {
        type: String
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Foundations', Foundations);