"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Asset_1 = require("../../../classes/Asset");
var Money_1 = require("../../../classes/Money");
function toObject(array, key) {
    return array.reduce(function (object, elem) {
        object[elem[key]] = elem;
        return object;
    }, {});
}
exports.default = {
    balanceListByAssets: function (balances, assets) {
        var hashMap = toObject(balances, 'id');
        return Promise.all(assets.map(function (asset) {
            if (hashMap[asset]) {
                return hashMap[asset];
            }
            else {
                return Asset_1.default.get(asset).then(function (a) {
                    return Money_1.default.fromCoins('0', a).then(function (amount) {
                        return {
                            id: a.id,
                            name: a.name,
                            precision: a.precision,
                            amount: amount
                        };
                    });
                });
            }
        }));
    }
};
//# sourceMappingURL=_combiners.js.map