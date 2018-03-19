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
var Transactions_1 = require("../../../classes/Transactions");
var ByteProcessor_1 = require("../../../classes/ByteProcessor");
var request_1 = require("../../../utils/request");
var remap_1 = require("../../../utils/remap");
var request_2 = require("../../../utils/request");
var orderbooks_x_1 = require("./orderbooks.x");
var GetOrdersAuthData = Transactions_1.default.createSignableData([
    new ByteProcessor_1.Base58('senderPublicKey'),
    new ByteProcessor_1.Long('timestamp')
]);
var CancelOrderAuthData = Transactions_1.default.createSignableData([
    new ByteProcessor_1.Base58('senderPublicKey'),
    new ByteProcessor_1.Base58('orderId')
]);
var fetch = request_1.createFetchWrapper(1 /* MATCHER */, 0 /* V1 */, request_1.processJSON);
var preCreateOrderAsync = function (data) { return orderbooks_x_1.createOrderSchema.parse(data); };
var postCreateOrder = function (data) {
    data.assetPair = {
        amountAsset: remap_1.normalizeAssetId(data.amountAsset),
        priceAsset: remap_1.normalizeAssetId(data.priceAsset)
    };
    delete data.amountAsset;
    delete data.priceAsset;
    return data;
};
var postCancelOrder = remap_1.createRemapper({
    senderPublicKey: 'sender'
});
var generateCancelLikeRequest = function (type) {
    return function (amountAssetId, priceAssetId, orderId, keyPair) {
        var authData = new CancelOrderAuthData({
            senderPublicKey: keyPair.publicKey,
            orderId: orderId
        });
        return authData.prepareForAPI(keyPair.privateKey)
            .then(postCancelOrder)
            .then(function (tx) {
            return fetch("/orderbook/" + amountAssetId + "/" + priceAssetId + "/" + type, __assign({}, request_2.POST_TEMPLATE, { body: JSON.stringify(tx) }));
        });
    };
};
exports.default = {
    getOrderbooks: function () {
        return fetch('/orderbook');
    },
    getOrderbook: function (assetOne, assetTwo) {
        return fetch("/orderbook/" + assetOne + "/" + assetTwo);
    },
    getOrders: function (assetOne, assetTwo, keyPair) {
        var authData = new GetOrdersAuthData({
            senderPublicKey: keyPair.publicKey,
            timestamp: Date.now()
        });
        return authData.prepareForAPI(keyPair.privateKey).then(function (preparedData) {
            return fetch("/orderbook/" + assetOne + "/" + assetTwo + "/publicKey/" + keyPair.publicKey, {
                headers: {
                    Timestamp: preparedData.timestamp,
                    Signature: preparedData.signature
                }
            });
        });
    },
    getAllOrders: function (keyPair) {
        var authData = new GetOrdersAuthData({
            senderPublicKey: keyPair.publicKey,
            timestamp: Date.now()
        });
        return authData.prepareForAPI(keyPair.privateKey).then(function (preparedData) {
            return fetch("/orderbook/" + keyPair.publicKey, {
                headers: {
                    Timestamp: preparedData.timestamp,
                    Signature: preparedData.signature
                }
            });
        });
    },
    createOrder: request_1.wrapTransactionRequest(Transactions_1.default.Order, preCreateOrderAsync, postCreateOrder, function (postParams) {
        return fetch('/orderbook', postParams);
    }),
    cancelOrder: generateCancelLikeRequest('cancel'),
    deleteOrder: generateCancelLikeRequest('delete')
};
//# sourceMappingURL=orderbooks.js.map