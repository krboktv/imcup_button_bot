"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../../utils/request");
var config_1 = require("../../../config");
var constants_1 = require("../../../constants");
var fetch = request_1.createFetchWrapper(0 /* NODE */, 0 /* V1 */, request_1.processJSON);
exports.default = {
    get: function (id) {
        if (id === constants_1.WAVES) {
            return Promise.resolve(constants_1.WAVES_V1_ISSUE_TX);
        }
        else {
            return fetch("/transactions/info/" + id);
        }
    },
    getList: function (address, limit) {
        if (limit === void 0) { limit = config_1.default.getRequestParams().limit; }
        // In the end of the line a strange response artifact is handled
        return fetch("/transactions/address/" + address + "/limit/" + limit).then(function (array) { return array[0]; });
    },
    utxSize: function () {
        return fetch('/transactions/unconfirmed/size');
    },
    utxGet: function (id) {
        return fetch("/transactions/unconfirmed/info/" + id);
    },
    utxGetList: function () {
        return fetch('/transactions/unconfirmed');
    }
};
//# sourceMappingURL=transactions.js.map