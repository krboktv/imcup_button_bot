"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constants = require("../../../constants");
var transactionTypes = (_a = {},
    _a[constants.ISSUE_TX_NAME] = constants.ISSUE_TX,
    _a[constants.TRANSFER_TX_NAME] = constants.TRANSFER_TX,
    _a[constants.REISSUE_TX_NAME] = constants.REISSUE_TX,
    _a[constants.BURN_TX_NAME] = constants.BURN_TX,
    _a[constants.EXCHANGE_TX_NAME] = constants.EXCHANGE_TX,
    _a[constants.LEASE_TX_NAME] = constants.LEASE_TX,
    _a[constants.CANCEL_LEASING_TX_NAME] = constants.CANCEL_LEASING_TX,
    _a[constants.CREATE_ALIAS_TX_NAME] = constants.CREATE_ALIAS_TX,
    _a);
exports.default = {
    transactionType: function (typeName) {
        return function (item) { return item.type && item.type === transactionTypes[typeName]; };
    },
    transactionSender: function (sender) {
        return function (item) { return item.sender && item.sender === sender; };
    },
    transactionRecipient: function (recipient) {
        return function (item) { return item.recipient && item.recipient === recipient; };
    }
};
var _a;
//# sourceMappingURL=_filters.js.map