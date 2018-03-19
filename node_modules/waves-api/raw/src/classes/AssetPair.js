"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../api/matcher/index");
var storage_1 = require("../utils/storage");
var Asset_1 = require("./Asset");
function getAssetIds(assetOne, assetTwo) {
    assetOne = Asset_1.default.isAsset(assetOne) ? assetOne.id : assetOne;
    assetTwo = Asset_1.default.isAsset(assetTwo) ? assetTwo.id : assetTwo;
    return [assetOne, assetTwo];
}
function getKey(part1, part2) {
    var parts = [part1, part2].sort();
    return parts[0] + "_" + parts[1];
}
function getMatcherPairOrder(assetOne, assetTwo) {
    return index_1.v1.getOrderbook(assetOne, assetTwo).then(function (orderbook) {
        return {
            amountAssetId: orderbook.pair.amountAsset,
            priceAssetId: orderbook.pair.priceAsset
        };
    });
}
var AssetPair = /** @class */ (function () {
    function AssetPair(amountAsset, priceAsset) {
        this.amountAsset = amountAsset;
        this.priceAsset = priceAsset;
        this.precisionDifference = priceAsset.precision - amountAsset.precision;
    }
    AssetPair.prototype.toJSON = function () {
        return {
            amountAsset: this.amountAsset.id,
            priceAsset: this.priceAsset.id
        };
    };
    AssetPair.prototype.toString = function () {
        return this.amountAsset + "/" + this.priceAsset;
    };
    return AssetPair;
}());
var storage = storage_1.getStorage();
exports.default = {
    get: function (assetOne, assetTwo) {
        var _a = getAssetIds(assetOne, assetTwo), assetOneId = _a[0], assetTwoId = _a[1];
        var key = getKey(assetOneId, assetTwoId);
        return storage.get(key).then(function (pair) {
            if (pair) {
                return pair;
            }
            else {
                return getMatcherPairOrder(assetOneId, assetTwoId).then(function (matcherPair) {
                    return Promise.all([
                        Asset_1.default.get(matcherPair.amountAssetId),
                        Asset_1.default.get(matcherPair.priceAssetId)
                    ]);
                }).then(function (assets) {
                    var newPair = new AssetPair(assets[0], assets[1]);
                    return storage.set(key, newPair);
                });
            }
        });
    },
    clearCache: function () {
        return storage.clear();
    },
    isAssetPair: function (object) {
        return object instanceof AssetPair;
    }
};
//# sourceMappingURL=AssetPair.js.map