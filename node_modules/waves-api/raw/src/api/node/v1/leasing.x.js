"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
var schemaFields_1 = require("../../schemaFields");
exports.leaseSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: schemaFields_1.default.publicKey,
        recipient: schemaFields_1.default.recipient,
        amount: {
            type: ts_api_validator_1.NumberPart,
            required: true
        },
        fee: schemaFields_1.default.fee,
        timestamp: schemaFields_1.default.timestamp
    }
});
exports.cancelLeasingSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: schemaFields_1.default.publicKey,
        transactionId: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        fee: schemaFields_1.default.fee,
        timestamp: schemaFields_1.default.timestamp
    }
});
//# sourceMappingURL=leasing.x.js.map