"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transactions_1 = require("../../../classes/Transactions");
var request_1 = require("../../../utils/request");
var aliases_x_1 = require("./aliases.x");
var remap_1 = require("../../../utils/remap");
var fetch = request_1.createFetchWrapper(0 /* NODE */, 0 /* V1 */, request_1.processJSON);
var preCreateAliasAsync = function (data) { return aliases_x_1.createAliasSchema.parse(data); };
var postCreateAlias = remap_1.createRemapper({
    transactionType: null
});
exports.default = {
    byAlias: function (alias) {
        return fetch("/alias/by-alias/" + alias);
    },
    byAddress: function (address) {
        return fetch("/alias/by-address/" + address);
    },
    createAlias: request_1.wrapTransactionRequest(Transactions_1.default.CreateAliasTransaction, preCreateAliasAsync, postCreateAlias, function (postParams) {
        return fetch('/alias/broadcast/create', postParams);
    })
};
//# sourceMappingURL=aliases.js.map