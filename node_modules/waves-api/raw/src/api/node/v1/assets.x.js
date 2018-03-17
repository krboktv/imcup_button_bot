"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
var remap_1 = require("../../../utils/remap");
var constants = require("../../../constants");
var schemaFields_1 = require("../../schemaFields");
exports.issueSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: schemaFields_1.default.publicKey,
        name: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        description: {
            type: ts_api_validator_1.StringPart,
            required: false,
            defaultValue: ''
        },
        quantity: {
            type: ts_api_validator_1.NumberPart,
            required: true
        },
        precision: {
            type: ts_api_validator_1.NumberPart,
            required: true,
            isValid: remap_1.precisionCheck
        },
        reissuable: schemaFields_1.default.reissuable,
        fee: schemaFields_1.default.issueFee,
        timestamp: schemaFields_1.default.timestamp
    }
});
exports.transferSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: schemaFields_1.default.publicKey,
        recipient: schemaFields_1.default.recipient,
        assetId: schemaFields_1.default.assetId,
        amount: {
            type: ts_api_validator_1.NumberPart,
            required: true
        },
        feeAssetId: {
            type: ts_api_validator_1.StringPart,
            required: false,
            defaultValue: constants.WAVES
        },
        fee: schemaFields_1.default.fee,
        attachment: {
            // TODO : make it possible to pass a byte array
            type: ts_api_validator_1.StringPart,
            required: false,
            defaultValue: ''
        },
        timestamp: schemaFields_1.default.timestamp
    }
});
exports.reissueSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: schemaFields_1.default.publicKey,
        assetId: schemaFields_1.default.assetId,
        quantity: {
            type: ts_api_validator_1.NumberPart,
            required: true
        },
        reissuable: schemaFields_1.default.reissuable,
        fee: schemaFields_1.default.issueFee,
        timestamp: schemaFields_1.default.timestamp
    }
});
exports.burnSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: schemaFields_1.default.publicKey,
        assetId: schemaFields_1.default.assetId,
        quantity: {
            type: ts_api_validator_1.NumberPart,
            required: true
        },
        fee: schemaFields_1.default.fee,
        timestamp: schemaFields_1.default.timestamp
    }
});
//# sourceMappingURL=assets.x.js.map