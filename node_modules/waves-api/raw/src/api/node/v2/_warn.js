"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../../../utils/logger");
function default_1(message) {
    logger_1.default.warn('API v2 is experimental, please mind that');
    message && logger_1.default.warn(message);
}
exports.default = default_1;
//# sourceMappingURL=_warn.js.map