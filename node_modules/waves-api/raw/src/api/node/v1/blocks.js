"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../../utils/request");
var fetch = request_1.createFetchWrapper(0 /* NODE */, 0 /* V1 */, request_1.processJSON);
exports.default = {
    get: function (signature) {
        return fetch("/blocks/signature/" + signature);
    },
    at: function (height) {
        return fetch("/blocks/at/" + height);
    },
    first: function () {
        return fetch('/blocks/first');
    },
    last: function () {
        return fetch('/blocks/last');
    },
    height: function () {
        return fetch('/blocks/height');
    }
};
//# sourceMappingURL=blocks.js.map