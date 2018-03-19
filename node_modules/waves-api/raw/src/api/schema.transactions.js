"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
var schema_Base58Part_1 = require("./schema.Base58Part");
var schema_MoneyPart_1 = require("./schema.MoneyPart");
var schema_OrderPricePart_1 = require("./schema.OrderPricePart");
var constants = require("../constants");
var remap_1 = require("../utils/remap");
var schemaTemporaryTools_1 = require("./schemaTemporaryTools");
var getTxCommonFields = function (typeName, wavesFeeOnly) { return ({
    transactionType: {
        type: ts_api_validator_1.StringPart,
        defaultValue: typeName
    },
    id: {
        type: ts_api_validator_1.StringPart,
        required: true
    },
    senderPublicKey: {
        type: ts_api_validator_1.StringPart,
        required: true
    },
    sender: {
        type: ts_api_validator_1.StringPart,
        required: true
    },
    fee: wavesFeeOnly ? {
        type: schema_MoneyPart_1.MoneyPart,
        required: true,
        assetId: '',
        parseValue: schemaTemporaryTools_1.stringConversion
    } : {
        type: schema_MoneyPart_1.MoneyPart,
        required: true,
        assetIdPath: 'feeAsset',
        parseValue: schemaTemporaryTools_1.stringConversion
    },
    height: {
        type: ts_api_validator_1.NumberPart
        // TODO : make it required in the new API
    },
    timestamp: {
        type: ts_api_validator_1.DatePart,
        required: true
    },
    signature: {
        type: ts_api_validator_1.StringPart,
        required: true
    }
}); };
var getTxRecipient = function () { return ({
    type: ts_api_validator_1.StringPart,
    required: true,
    parseValue: remap_1.removeAliasPrefix
}); };
var getTxRecipientAddress = function () { return ({
    type: ts_api_validator_1.StringPart,
    required: true,
    parseValue: schemaTemporaryTools_1.stub('string')
}); };
var getTxAssetId = function (path) { return ({
    type: ts_api_validator_1.StringPart,
    required: true,
    path: path,
    parseValue: function (d) { return d ? d : constants.WAVES; }
}); };
var getTxAssetName = function () { return ({
    type: ts_api_validator_1.StringPart,
    required: true
}); };
var getTxAssetDescription = function () { return ({
    type: ts_api_validator_1.StringPart,
    required: true
}); };
var getTxAssetPrecision = function () { return ({
    type: ts_api_validator_1.NumberPart,
    required: true,
    path: 'decimals'
}); };
var getTxAssetTotalAmount = function (path, assetIdPath) { return ({
    type: schema_MoneyPart_1.MoneyPart,
    required: true,
    path: path,
    assetIdPath: assetIdPath,
    parseValue: schemaTemporaryTools_1.stringConversion
}); };
var getTxAssetReissuable = function () { return ({
    type: ts_api_validator_1.BooleanPart,
    required: true
}); };
var getTxAmount = function (assetIdPath) { return ({
    type: schema_MoneyPart_1.MoneyPart,
    required: true,
    assetIdPath: assetIdPath,
    parseValue: schemaTemporaryTools_1.stringConversion
}); };
var getTxWavesAmount = function () { return ({
    type: schema_MoneyPart_1.MoneyPart,
    required: true,
    assetId: '',
    parseValue: schemaTemporaryTools_1.stringConversion
}); };
var getTxPrice = function (amountAssetIdPath, priceAssetIdPath) { return ({
    type: schema_OrderPricePart_1.OrderPricePart,
    required: true,
    amountAssetIdPath: amountAssetIdPath,
    priceAssetIdPath: priceAssetIdPath,
    parseValue: schemaTemporaryTools_1.stringConversion
}); };
var getTxWavesFee = function (path) { return ({
    type: schema_MoneyPart_1.MoneyPart,
    required: true,
    path: path,
    assetId: '',
    parseValue: schemaTemporaryTools_1.stringConversion
}); };
var getTxAttachment = function () { return ({
    type: schema_Base58Part_1.Base58Part,
    defaultValue: ''
}); };
var getTxRawAttachment = function (path) { return ({
    type: ts_api_validator_1.StringPart,
    defaultValue: '',
    path: path
}); };
var getTxLeaseTransactionId = function (path) { return ({
    type: ts_api_validator_1.StringPart,
    required: true,
    path: path
}); };
var getTxAlias = function () { return ({
    type: ts_api_validator_1.StringPart,
    required: true,
    parseValue: remap_1.removeAliasPrefix
}); };
var getTxOrder = function (path) { return ({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    path: path,
    content: {
        id: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        type: {
            type: ts_api_validator_1.StringPart,
            required: true,
            path: path + ".orderType"
        },
        senderPublicKey: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        sender: {
            type: ts_api_validator_1.StringPart,
            required: true,
            parseValue: schemaTemporaryTools_1.stub('string')
        },
        matcherPublicKey: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        amountAsset: getTxAssetId(path + ".assetPair.amountAsset"),
        amount: getTxAmount(path + ".assetPair.amountAsset"),
        priceAsset: getTxAssetId(path + ".assetPair.priceAsset"),
        price: getTxPrice(path + ".assetPair.amountAsset", path + ".assetPair.priceAsset"),
        matcherFee: getTxWavesFee()
    }
}); };
exports.issueTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.ISSUE_TX_NAME, true), { assetId: getTxAssetId(), name: getTxAssetName(), description: getTxAssetDescription(), precision: getTxAssetPrecision(), quantity: getTxAssetTotalAmount('quantity', 'assetId'), reissuable: getTxAssetReissuable() })
});
exports.transferTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.TRANSFER_TX_NAME, false), { recipient: getTxRecipient(), recipientAddress: getTxRecipientAddress(), attachment: getTxAttachment(), rawAttachment: getTxRawAttachment('attachment'), assetId: getTxAssetId(), amount: getTxAmount('assetId'), feeAssetId: getTxAssetId('feeAsset') })
});
exports.reissueTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.REISSUE_TX_NAME, true), { assetId: getTxAssetId(), quantity: getTxAssetTotalAmount('quantity', 'assetId'), reissuable: getTxAssetReissuable() })
});
exports.burnTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.BURN_TX_NAME, true), { assetId: getTxAssetId(), quantity: getTxAssetTotalAmount('amount', 'assetId') })
});
exports.exchangeTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.EXCHANGE_TX_NAME, true), { amountAsset: getTxAssetId('order1.assetPair.amountAsset'), amount: getTxAmount('order1.assetPair.amountAsset'), priceAsset: getTxAssetId('order1.assetPair.priceAsset'), price: getTxPrice('order1.assetPair.amountAsset', 'order1.assetPair.priceAsset'), buyOrder: getTxOrder('order1'), buyMatcherFee: getTxWavesFee(), sellOrder: getTxOrder('order2'), sellMatcherFee: getTxWavesFee() })
});
exports.leaseTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.LEASE_TX_NAME, true), { recipient: getTxRecipient(), recipientAddress: getTxRecipientAddress(), amount: getTxWavesAmount() })
});
exports.cancelLeasingTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.CANCEL_LEASING_TX_NAME, true), { leaseTransactionId: getTxLeaseTransactionId('leaseId') })
});
exports.createAliasTransactionSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: __assign({}, getTxCommonFields(constants.CREATE_ALIAS_TX_NAME, true), { alias: getTxAlias() })
});
//# sourceMappingURL=schema.transactions.js.map