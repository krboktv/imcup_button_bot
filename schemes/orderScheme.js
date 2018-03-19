const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Order = new Schema({
    user_id: {
        type: String,
        default: ""
    },
    product_num: {
        type: String,
        default: ""
    },
    sumInRub: {
        type: String,
        default: ""
    },
    sumInCrypto: {
        type: String,
        default: ""
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Order', Order);