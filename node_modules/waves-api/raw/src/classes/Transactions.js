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
var ByteProcessor_1 = require("./ByteProcessor");
var concat_1 = require("../utils/concat");
var crypto_1 = require("../utils/crypto");
var base58_1 = require("../libs/base58");
var constants = require("../constants");
var config_1 = require("../config");
function createTransactionClass(txType, fields, apiSchema) {
    if (!fields || !fields.length) {
        throw new Error('It is not possible to create TransactionClass without fields');
    }
    // Fields of the original data object
    var storedFields = Object.create(null);
    // Data bytes or functions returning data bytes via promises
    var byteProviders = [];
    fields.forEach(function (field) {
        if (field instanceof ByteProcessor_1.ByteProcessor) {
            // Remember user data fields
            storedFields[field.name] = field;
            // All user data must be represented as bytes
            byteProviders.push(function (data) { return field.process(data[field.name]); });
        }
        else if (typeof field === 'number') {
            // All static data must be converted to bytes as well
            byteProviders.push(Uint8Array.from([field]));
        }
        else {
            throw new Error('Invalid field is passed to the createTransactionClass function');
        }
    });
    var TransactionClass = /** @class */ (function () {
        function TransactionClass(hashMap) {
            if (hashMap === void 0) { hashMap = {}; }
            var _this = this;
            // Save all needed values from user data
            this._rawData = Object.keys(storedFields).reduce(function (store, key) {
                store[key] = hashMap[key];
                return store;
            }, {});
            this._dataHolders = byteProviders.map(function (provider) {
                if (typeof provider === 'function') {
                    // Execute function so that they return promises containing Uint8Array data
                    return provider(_this._rawData);
                }
                else {
                    // Or just pass Uint8Array data
                    return provider;
                }
            });
        }
        // Process the data so it's ready for usage in API
        TransactionClass.prototype.prepareForAPI = function (privateKey) {
            var _this = this;
            // Sign data and extend its object with signature and transaction type
            return this.getSignature(privateKey).then(function (signature) {
                // Transform data so it could match the API requirements
                return _this._castToAPISchema(_this._rawData).then(function (schemedData) { return (__assign({}, (txType ? { transactionType: txType } : {}), schemedData, { signature: signature })); });
            });
        };
        // Sign transaction and return only signature
        TransactionClass.prototype.getSignature = function (privateKey) {
            return this.getBytes().then(function (dataBytes) {
                return crypto_1.default.buildTransactionSignature(dataBytes, privateKey);
            });
        };
        // Get byte representation of the transaction
        TransactionClass.prototype.getBytes = function () {
            return Promise.all(this._dataHolders).then(function (multipleDataBytes) {
                return concat_1.concatUint8Arrays.apply(void 0, multipleDataBytes);
            });
        };
        // Get bytes of an exact field from user data
        TransactionClass.prototype.getExactBytes = function (fieldName) {
            if (!(fieldName in storedFields)) {
                throw new Error("There is no field '" + fieldName + "' in '" + txType + " RequestDataType class");
            }
            var byteProcessor = storedFields[fieldName];
            var userData = this._rawData[fieldName];
            return byteProcessor.process(userData);
        };
        TransactionClass.prototype._castToAPISchema = function (data) {
            var _this = this;
            if (!apiSchema)
                return Promise.resolve(__assign({}, data));
            // Generate an array of promises wielding the schemed data
            var transforms = Object.keys(apiSchema).map(function (key) {
                var rule = apiSchema[key];
                if (rule.from === 'bytes' && rule.to === 'base58') {
                    return _this._castFromBytesToBase58(key);
                }
                if (rule.from === 'raw' && rule.to === 'prefixed') {
                    return _this._castFromRawToPrefixed(key);
                }
            });
            return Promise.all(transforms).then(function (schemedParts) {
                return schemedParts.reduce(function (result, part) {
                    return __assign({}, result, part);
                }, __assign({}, data));
            });
        };
        TransactionClass.prototype._castFromBytesToBase58 = function (key) {
            return this.getExactBytes(key).then(function (bytes) {
                if (key === 'attachment') {
                    bytes = Uint8Array.from(Array.prototype.slice.call(bytes, 2));
                }
                return _a = {}, _a[key] = base58_1.default.encode(bytes), _a;
                var _a;
            });
        };
        TransactionClass.prototype._castFromRawToPrefixed = function (key) {
            var type = key;
            if (type === 'recipient') {
                type = this._rawData[key].length <= 30 ? 'alias' : 'address';
            }
            var prefix;
            if (type === 'address') {
                prefix = 'address:';
            }
            else if (type === 'alias') {
                var networkCharacter = String.fromCharCode(config_1.default.getNetworkByte());
                prefix = 'alias:' + networkCharacter + ':';
            }
            else {
                throw new Error("There is no type '" + type + "' to be prefixed");
            }
            return Promise.resolve((_a = {}, _a[key] = prefix + this._rawData[key], _a));
            var _a;
        };
        return TransactionClass;
    }());
    return TransactionClass;
}
exports.default = {
    IssueTransaction: createTransactionClass(constants.ISSUE_TX_NAME, [
        constants.ISSUE_TX,
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.StringWithLength('name'),
        new ByteProcessor_1.StringWithLength('description'),
        new ByteProcessor_1.Long('quantity'),
        new ByteProcessor_1.Byte('precision'),
        new ByteProcessor_1.Bool('reissuable'),
        new ByteProcessor_1.Long('fee'),
        new ByteProcessor_1.Long('timestamp')
    ]),
    TransferTransaction: createTransactionClass(constants.TRANSFER_TX_NAME, [
        constants.TRANSFER_TX,
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.AssetId('assetId'),
        new ByteProcessor_1.AssetId('feeAssetId'),
        new ByteProcessor_1.Long('timestamp'),
        new ByteProcessor_1.Long('amount'),
        new ByteProcessor_1.Long('fee'),
        new ByteProcessor_1.Recipient('recipient'),
        new ByteProcessor_1.Attachment('attachment')
    ], {
        attachment: {
            from: 'bytes',
            to: 'base58'
        },
        recipient: {
            from: 'raw',
            to: 'prefixed'
        }
    }),
    ReissueTransaction: createTransactionClass(constants.REISSUE_TX_NAME, [
        constants.REISSUE_TX,
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.MandatoryAssetId('assetId'),
        new ByteProcessor_1.Long('quantity'),
        new ByteProcessor_1.Bool('reissuable'),
        new ByteProcessor_1.Long('fee'),
        new ByteProcessor_1.Long('timestamp')
    ]),
    BurnTransaction: createTransactionClass(constants.BURN_TX_NAME, [
        constants.BURN_TX,
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.MandatoryAssetId('assetId'),
        new ByteProcessor_1.Long('quantity'),
        new ByteProcessor_1.Long('fee'),
        new ByteProcessor_1.Long('timestamp')
    ]),
    LeaseTransaction: createTransactionClass(constants.LEASE_TX_NAME, [
        constants.LEASE_TX,
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.Recipient('recipient'),
        new ByteProcessor_1.Long('amount'),
        new ByteProcessor_1.Long('fee'),
        new ByteProcessor_1.Long('timestamp')
    ], {
        recipient: {
            from: 'raw',
            to: 'prefixed'
        }
    }),
    CancelLeasingTransaction: createTransactionClass(constants.CANCEL_LEASING_TX_NAME, [
        constants.CANCEL_LEASING_TX,
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.Long('fee'),
        new ByteProcessor_1.Long('timestamp'),
        new ByteProcessor_1.Base58('transactionId')
    ]),
    CreateAliasTransaction: createTransactionClass(constants.CREATE_ALIAS_TX_NAME, [
        constants.CREATE_ALIAS_TX,
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.Alias('alias'),
        new ByteProcessor_1.Long('fee'),
        new ByteProcessor_1.Long('timestamp')
    ]),
    // That's not exactly a transaction so it has no type
    Order: createTransactionClass(null, [
        new ByteProcessor_1.Base58('senderPublicKey'),
        new ByteProcessor_1.Base58('matcherPublicKey'),
        new ByteProcessor_1.AssetId('amountAsset'),
        new ByteProcessor_1.AssetId('priceAsset'),
        new ByteProcessor_1.OrderType('orderType'),
        new ByteProcessor_1.Long('price'),
        new ByteProcessor_1.Long('amount'),
        new ByteProcessor_1.Long('timestamp'),
        new ByteProcessor_1.Long('expiration'),
        new ByteProcessor_1.Long('matcherFee')
    ]),
    createSignableData: function (fields) {
        return createTransactionClass(null, fields);
    }
};
//# sourceMappingURL=Transactions.js.map