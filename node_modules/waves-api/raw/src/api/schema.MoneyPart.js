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
var ts_utils_1 = require("ts-utils");
var remap_1 = require("../utils/remap");
var Money_1 = require("../classes/Money");
// TODO : replace `fromCoins` with `fromTokens` in the new API
var MoneyPart = /** @class */ (function (_super) {
    __extends(MoneyPart, _super);
    function MoneyPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MoneyPart.prototype.process = function (data) {
        this._data = data;
        return _super.prototype.process.call(this, data);
    };
    MoneyPart.prototype.getValue = function (value) {
        if (value && Money_1.default.isMoney(value)) {
            return value;
        }
        else if (typeof value === 'string') {
            if (this.options.assetId || this.options.assetId === '') {
                return Money_1.default.fromCoins(value, remap_1.denormalizeAssetId(this.options.assetId));
            }
            else if (this.options.assetIdPath) {
                var id = ts_utils_1.get(this._data, this.options.assetIdPath);
                return Money_1.default.fromCoins(value, remap_1.denormalizeAssetId(id));
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    };
    return MoneyPart;
}(ts_api_validator_1.BasePart));
exports.MoneyPart = MoneyPart;
//# sourceMappingURL=schema.MoneyPart.js.map