var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var fastSwap = new Schema({
    num: {
        type: Number,
        default: 1
    },
    // Данные пользователя
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
    // Валюта
    currency: {
        type: String,
        default: ''
    },
    // Сумма в крипте
    sumCrypto: {
        type: Number,
        default: ''
    },
    sumRub: {
        type: Number,
        default: ''
    },
    // Тип ордера
    type: {
        type: Number,
        default: '' // Если 0 - то покупка, если 1, то продажа
    },
    // Платёжный сервис
    cardService: {
        type: String,
        default: ''
    },
     // Платёжный сервис: номер
     KYC: {
        type: String,
        default: ''
    },
    // Время создания ордера
    time: {
        type: Number,
        default: Date.now()
    },
    endTime: {
        type: Number,
        default: 0
    },
    end: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('fastSwap', fastSwap);