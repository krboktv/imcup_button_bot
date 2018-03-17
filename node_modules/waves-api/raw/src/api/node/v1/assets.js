"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transactions_1 = require("../../../classes/Transactions");
var request_1 = require("../../../utils/request");
var assets_x_1 = require("./assets.x");
var addresses_1 = require("./addresses");
var remap_1 = require("../../../utils/remap");
var constants = require("../../../constants");
var fetch = request_1.createFetchWrapper(0 /* NODE */, 0 /* V1 */, request_1.processJSON);
var preIssueAsync = function (data) { return assets_x_1.issueSchema.parse(data); };
var postIssue = remap_1.createRemapper({
    transactionType: null,
    precision: 'decimals'
});
var preTransferAsync = function (data) { return assets_x_1.transferSchema.parse(data); };
var postTransfer = remap_1.createRemapper({
    transactionType: null,
    assetId: remap_1.normalizeAssetId,
    feeAssetId: remap_1.normalizeAssetId
});
var preReissueAsync = function (data) { return assets_x_1.reissueSchema.parse(data); };
var postReissue = remap_1.createRemapper({
    transactionType: null
});
var preBurnAsync = function (data) { return assets_x_1.burnSchema.parse(data); };
var postBurn = remap_1.createRemapper(({
    transactionType: null
}));
exports.default = {
    balances: function (address) {
        return fetch("/assets/balance/" + address);
    },
    balance: function (address, assetId) {
        if (assetId === constants.WAVES) {
            return addresses_1.default.balance(address);
        }
        else {
            return fetch("/assets/balance/" + address + "/" + assetId);
        }
    },
    distribution: function (assetId) {
        return fetch("/assets/" + assetId + "/distribution");
    },
    issue: request_1.wrapTransactionRequest(Transactions_1.default.IssueTransaction, preIssueAsync, postIssue, function (postParams) {
        return fetch('/assets/broadcast/issue', postParams);
    }),
    transfer: request_1.wrapTransactionRequest(Transactions_1.default.TransferTransaction, preTransferAsync, postTransfer, function (postParams) {
        return fetch('/assets/broadcast/transfer', postParams);
    }),
    reissue: request_1.wrapTransactionRequest(Transactions_1.default.ReissueTransaction, preReissueAsync, postReissue, function (postParams) {
        return fetch('/assets/broadcast/reissue', postParams);
    }),
    burn: request_1.wrapTransactionRequest(Transactions_1.default.BurnTransaction, preBurnAsync, postBurn, function (postParams) {
        return fetch('/assets/broadcast/burn', postParams);
    })
};
//# sourceMappingURL=assets.js.map