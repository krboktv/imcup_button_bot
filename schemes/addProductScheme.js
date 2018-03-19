const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Products = new Schema({
    num: {
        type: Number,
        default: 0
    },
    user_id: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        default: ""
    },
    shortDescription: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    price: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    emotions: {
        // type: Array,
        // default: []
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Products', Products);