"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("../libs/bignumber");
var AssetPair_1 = require("./AssetPair");
var OrderPrice = /** @class */ (function () {
    function OrderPrice(coins, pair) {
        var divider = OrderPrice._getMatcherDivider(pair.precisionDifference);
        this.pair = pair;
        this._matcherCoins = new bignumber_1.default(coins);
        this._tokens = this._matcherCoins.div(divider);
    }
    OrderPrice.prototype.getMatcherCoins = function () {
        return this._matcherCoins.add(0);
    };
    OrderPrice.prototype.getTokens = function () {
        return this._tokens.add(0);
    };
    OrderPrice.prototype.toMatcherCoins = function () {
        return this._matcherCoins.toFixed(0);
    };
    OrderPrice.prototype.toTokens = function () {
        return this._tokens.toFixed(this.pair.priceAsset.precision);
    };
    OrderPrice.prototype.toFormat = function () {
        return this._tokens.toFormat(this.pair.priceAsset.precision);
    };
    OrderPrice.prototype.toJSON = function () {
        return {
            amountAssetId: this.pair.amountAsset.id,
            priceAssetId: this.pair.priceAsset.id,
            priceTokens: this.toTokens()
        };
    };
    OrderPrice.prototype.toString = function () {
        return this.toTokens() + " " + this.pair.amountAsset.id + "/" + this.pair.priceAsset.id;
    };
    OrderPrice.fromTokens = function (tokens, pair, secondAsset) {
        OrderPrice._checkAmount(tokens);
        return OrderPrice._getPair(pair, secondAsset).then(function (p) {
            tokens = new bignumber_1.default(tokens).toFixed(p.priceAsset.precision);
            var divider = OrderPrice._getMatcherDivider(p.precisionDifference);
            var coins = new bignumber_1.default(tokens).mul(divider);
            return new OrderPrice(coins, p);
        });
    };
    OrderPrice.fromMatcherCoins = function (coins, pair, secondAsset) {
        OrderPrice._checkAmount(coins);
        return OrderPrice._getPair(pair, secondAsset).then(function (p) {
            return new OrderPrice(coins, p);
        });
    };
    OrderPrice.isOrderPrice = function (object) {
        return object instanceof OrderPrice;
    };
    OrderPrice._checkAmount = function (amount) {
        if (!(typeof amount === 'string' || amount instanceof bignumber_1.default)) {
            throw new Error('Please use strings to create instances of OrderPrice');
        }
    };
    OrderPrice._getPair = function (pair, secondAsset) {
        if (AssetPair_1.default.isAssetPair(pair)) {
            return Promise.resolve(pair);
        }
        else if (pair && secondAsset) {
            // Here, both `pair` and `secondAsset` are assets
            return AssetPair_1.default.get(pair, secondAsset);
        }
        else {
            throw new Error('Invalid data passed instead AssetPair');
        }
    };
    OrderPrice._getMatcherDivider = function (precision) {
        return new bignumber_1.default(10).pow(precision).mul(OrderPrice._MATCHER_SCALE);
    };
    OrderPrice._MATCHER_SCALE = new bignumber_1.default(10).pow(8);
    return OrderPrice;
}());
exports.default = OrderPrice;
//# sourceMappingURL=OrderPrice.js.map