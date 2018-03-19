"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("../libs/bignumber");
var Asset_1 = require("./Asset");
var Money = /** @class */ (function () {
    function Money(coins, asset) {
        var divider = Money._getDivider(asset.precision);
        this.asset = asset;
        this._coins = new bignumber_1.default(coins);
        this._tokens = this._coins.div(divider);
    }
    Money.prototype.getCoins = function () {
        return this._coins.add(0);
    };
    Money.prototype.getTokens = function () {
        return this._tokens.add(0);
    };
    Money.prototype.toCoins = function () {
        return this._coins.toFixed(0);
    };
    Money.prototype.toTokens = function () {
        return this._tokens.toFixed(this.asset.precision);
    };
    Money.prototype.toFormat = function () {
        return this._tokens.toFormat(this.asset.precision);
    };
    Money.prototype.add = function (money) {
        this._matchAssets(money);
        var inputCoins = money.getCoins();
        var result = this._coins.add(inputCoins);
        return new Money(result, this.asset);
    };
    Money.prototype.plus = function (money) {
        return this.add(money);
    };
    Money.prototype.sub = function (money) {
        this._matchAssets(money);
        var inputCoins = money.getCoins();
        var result = this._coins.sub(inputCoins);
        return new Money(result, this.asset);
    };
    Money.prototype.minus = function (money) {
        return this.sub(money);
    };
    Money.prototype.eq = function (money) {
        this._matchAssets(money);
        return this._coins.eq(money.getCoins());
    };
    Money.prototype.lt = function (money) {
        this._matchAssets(money);
        return this._coins.lt(money.getCoins());
    };
    Money.prototype.lte = function (money) {
        this._matchAssets(money);
        return this._coins.lte(money.getCoins());
    };
    Money.prototype.gt = function (money) {
        this._matchAssets(money);
        return this._coins.gt(money.getCoins());
    };
    Money.prototype.gte = function (money) {
        this._matchAssets(money);
        return this._coins.gte(money.getCoins());
    };
    Money.prototype.cloneWithCoins = function (coins) {
        Money._checkAmount(coins);
        return new Money(coins, this.asset);
    };
    Money.prototype.cloneWithTokens = function (tokens) {
        Money._checkAmount(tokens);
        var coins = Money._tokensToCoins(tokens, this.asset.precision);
        return new Money(coins, this.asset);
    };
    Money.prototype.convertTo = function (asset, exchangeRate) {
        return Money.convert(this, asset, exchangeRate);
    };
    Money.prototype.toJSON = function () {
        return {
            assetId: this.asset.id,
            tokens: this.toTokens()
        };
    };
    Money.prototype.toString = function () {
        return this.toTokens() + " " + this.asset.id;
    };
    Money.prototype._matchAssets = function (money) {
        if (this.asset.id !== money.asset.id) {
            throw new Error('You cannot apply arithmetic operations to Money created with different assets');
        }
    };
    Money.fromCoins = function (coins, supposedAsset) {
        Money._checkAmount(coins);
        return Asset_1.default.get(supposedAsset).then(function (asset) {
            return new Money(coins, asset);
        });
    };
    Money.fromTokens = function (tokens, supposedAsset) {
        Money._checkAmount(tokens);
        return Asset_1.default.get(supposedAsset).then(function (asset) {
            var coins = Money._tokensToCoins(tokens, asset.precision);
            return new Money(coins, asset);
        });
    };
    Money.convert = function (money, asset, exchangeRate) {
        if (money.asset === asset) {
            return money;
        }
        else {
            var difference = money.asset.precision - asset.precision;
            var divider = new bignumber_1.default(10).pow(difference);
            var coins = money.getCoins();
            var result = coins.mul(exchangeRate).div(divider);
            return new Money(result, asset);
        }
    };
    Money.isMoney = function (object) {
        return object instanceof Money;
    };
    Money._checkAmount = function (amount) {
        if (!(typeof amount === 'string' || amount instanceof bignumber_1.default)) {
            throw new Error('Please use strings to create instances of Money');
        }
    };
    Money._tokensToCoins = function (tokens, precision) {
        var divider = Money._getDivider(precision);
        tokens = new bignumber_1.default(tokens).toFixed(precision);
        return new bignumber_1.default(tokens).mul(divider);
    };
    Money._getDivider = function (precision) {
        return new bignumber_1.default(10).pow(precision);
    };
    return Money;
}());
exports.default = Money;
//# sourceMappingURL=Money.js.map