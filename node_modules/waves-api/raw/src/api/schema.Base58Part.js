"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
var converters_1 = require("../libs/converters");
var base58_1 = require("../libs/base58");
var Base58Part = /** @class */ (function (_super) {
    __extends(Base58Part, _super);
    function Base58Part() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Base58Part.prototype.getValue = function (value) {
        if (value === void 0) { value = ''; }
        var bytes = base58_1.default.decode(value);
        try {
            return converters_1.default.byteArrayToString(bytes);
        }
        catch (e) {
            return null;
        }
    };
    return Base58Part;
}(ts_api_validator_1.BasePart));
exports.Base58Part = Base58Part;
//# sourceMappingURL=schema.Base58Part.js.map