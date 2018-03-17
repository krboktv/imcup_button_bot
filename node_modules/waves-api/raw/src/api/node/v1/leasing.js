"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Transactions_1 = require("../../../classes/Transactions");
var request_1 = require("../../../utils/request");
var remap_1 = require("../../../utils/remap");
var leasing_x_1 = require("./leasing.x");
var fetch = request_1.createFetchWrapper(0 /* NODE */, 0 /* V1 */, request_1.processJSON);
var preLeaseAsync = function (data) { return leasing_x_1.leaseSchema.parse(data); };
var postLease = remap_1.createRemapper({
    transactionType: null
});
var preCancelLeasingAsync = function (data) { return leasing_x_1.cancelLeasingSchema.parse(data); };
var postCancelLeasing = remap_1.createRemapper({
    transactionType: null,
    transactionId: 'txId'
});
exports.default = {
    lease: request_1.wrapTransactionRequest(Transactions_1.default.LeaseTransaction, preLeaseAsync, postLease, function (postParams) {
        return fetch('/leasing/broadcast/lease', postParams);
    }),
    cancelLeasing: request_1.wrapTransactionRequest(Transactions_1.default.CancelLeasingTransaction, preCancelLeasingAsync, postCancelLeasing, function (postParams) {
        return fetch('/leasing/broadcast/cancel', postParams);
    })
};
//# sourceMappingURL=leasing.js.map