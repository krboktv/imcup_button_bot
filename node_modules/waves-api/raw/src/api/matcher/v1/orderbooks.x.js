"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
var schemaFields_1 = require("../../schemaFields");
var constants_1 = require("../../../constants");
exports.createOrderSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: schemaFields_1.default.publicKey,
        matcherPublicKey: schemaFields_1.default.publicKey,
        amountAsset: schemaFields_1.default.assetId,
        priceAsset: schemaFields_1.default.assetId,
        orderType: {
            type: ts_api_validator_1.StringPart,
            required: true,
            isValid: function (orderType) {
                return orderType === 'buy' || orderType === 'sell';
            }
        },
        amount: {
            type: ts_api_validator_1.NumberPart,
            required: true
        },
        price: {
            type: ts_api_validator_1.NumberPart,
            required: true
        },
        timestamp: schemaFields_1.default.timestamp,
        expiration: {
            type: ts_api_validator_1.NumberPart,
            required: true,
            parseValue: function (expiration) {
                if (expiration) {
                    return expiration;
                }
                else {
                    var date = new Date();
                    return date.setDate(date.getDate() + constants_1.DEFAULT_ORDER_EXPIRATION_DAYS);
                }
            }
        },
        matcherFee: schemaFields_1.default.matcherFee
    }
});
//# sourceMappingURL=orderbooks.x.js.map