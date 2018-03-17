"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request_1 = require("../../../utils/request");
var fetch = request_1.createFetchWrapper(1 /* MATCHER */, 0 /* V1 */, request_1.processJSON);
exports.default = {
    getMatcherKey: function () {
        return fetch('/');
    }
};
//# sourceMappingURL=info.js.map