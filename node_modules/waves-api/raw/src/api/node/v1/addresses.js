"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../../utils/request");
var fetch = request_1.createFetchWrapper(0 /* NODE */, 0 /* V1 */, request_1.processJSON);
exports.default = {
    balance: function (address, confirmations) {
        if (!confirmations) {
            return fetch("/addresses/balance/" + address);
        }
        else {
            return fetch("/addresses/balance/" + address + "/" + confirmations);
        }
    },
    balanceDetails: function (address) {
        return fetch("/addresses/balance/details/" + address);
    }
};
//# sourceMappingURL=addresses.js.map