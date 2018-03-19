var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Swap = new Schema({
    num: {
        type: Number,
        default: 1
    },
    // Данные первого пользователя
    user_id1: {
        type: String,
        default: ''
    },
    // Данные второго пользователя
    user_id2: {
        type: String,
        default: 'no' // Если 'no', то тогда выводим в активные, иначе - в ожидании перевода денег
    },
    // Валюта
    currency: {
        type: String,
        default: ''
    },
    // Сумма в крипте
    sumCripto: {
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
     cardServiceNum: {
        type: Number,
        default: 0
    },
    // Время создания ордера
    time: {
        type: Number,
        default: Date.now()
    },
    // Время закрытия ордера
    exitTime: {
        type: Number,
        default: ''
    },
    // Подтверждение человека об отправке средств
    confirmBuy: {
        type: String,
        default: 'нет'
    },
    // Подтверждение человека о получении средств
    confirmSell: {
        type: String,
        default: 'нет'
    },
    end: {
        type: Boolean,
        default: false
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('Swap', Swap);