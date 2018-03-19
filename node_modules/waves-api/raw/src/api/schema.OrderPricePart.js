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
var OrderPrice_1 = require("../classes/OrderPrice");
// TODO : replace `fromMatcherCoins` with `fromTokens` in the new API
var OrderPricePart = /** @class */ (function (_super) {
    __extends(OrderPricePart, _super);
    function OrderPricePart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderPricePart.prototype.process = function (data) {
        this._data = data;
        return _super.prototype.process.call(this, data);
    };
    OrderPricePart.prototype.getValue = function (value) {
        if (value && OrderPrice_1.default.isOrderPrice(value)) {
            return value;
        }
        else if (typeof value === 'string') {
            var amountAssetId = void 0;
            if (typeof this.options.amountAssetId === 'string') {
                amountAssetId = remap_1.denormalizeAssetId(this.options.amountAssetId);
            }
            else if (this.options.amountAssetIdPath) {
                amountAssetId = remap_1.denormalizeAssetId(ts_utils_1.get(this._data, this.options.amountAssetIdPath));
            }
            var priceAssetId = void 0;
            if (typeof this.options.priceAssetId === 'string') {
                priceAssetId = remap_1.denormalizeAssetId(this.options.priceAssetId);
            }
            else if (this.options.priceAssetIdPath) {
                priceAssetId = remap_1.denormalizeAssetId(ts_utils_1.get(this._data, this.options.priceAssetIdPath));
            }
            if (!amountAssetId || !priceAssetId) {
                return null;
            }
            else {
                return OrderPrice_1.default.fromMatcherCoins(value, amountAssetId, priceAssetId);
            }
        }
        else {
            return null;
        }
    };
    return OrderPricePart;
}(ts_api_validator_1.BasePart));
exports.OrderPricePart = OrderPricePart;
//# sourceMappingURL=schema.OrderPricePart.js.map