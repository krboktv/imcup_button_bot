"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transactions_1 = require("../v1/transactions");
var schemaTools_1 = require("../../schemaTools");
var constants_1 = require("../../../constants");
function extendTransaction(transaction) {
    if (transaction.transactionType === constants_1.CANCEL_LEASING_TX_NAME) {
        return transactions_1.default.get(transaction.leaseTransactionId)
            .then(schemaTools_1.siftTransaction)
            .then(function (leaseTransaction) {
            transaction.leaseTransactionAmount = leaseTransaction.amount;
            return transaction;
        });
    }
    else {
        return transaction;
    }
}
exports.default = {
    get: function (id) {
        if (id === constants_1.WAVES) {
            return schemaTools_1.siftTransaction(constants_1.WAVES_V1_ISSUE_TX);
        }
        else {
            return transactions_1.default.get(id)
                .then(schemaTools_1.siftTransaction)
                .then(extendTransaction);
        }
    },
    utxGet: function (id) {
        return transactions_1.default.utxGet(id)
            .then(schemaTools_1.siftTransaction)
            .then(extendTransaction);
    }
};
//# sourceMappingURL=transactions.js.map