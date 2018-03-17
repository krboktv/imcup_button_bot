"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var schemas = require("./addresses.x");
var constants = require("../../../constants");
var Money_1 = require("../../../classes/Money");
var schemaTools_1 = require("../../schemaTools");
/** TEMPORARY MOCKS */
var addresses_1 = require("../v1/addresses");
var aliases_1 = require("../v1/aliases");
var assets_1 = require("../v1/assets");
var transactions_1 = require("../v1/transactions");
var _combiners_1 = require("./_combiners");
var _filters_1 = require("./_filters");
var _warn_1 = require("./_warn");
function getBalances(address, options) {
    // TODO : avoid unnecessary requests if the asset option is provided and Waves or any assets are not in it
    var wavesBalance = addresses_1.default.balanceDetails(address).then(function (data) {
        return Money_1.default.fromCoins(String(data.available), constants.WAVES).then(function (amount) { return [amount]; });
    });
    var assetBalances = assets_1.default.balances(address).then(function (data) {
        return schemas.assetBalancesSchema.parse(data).then(function (balances) {
            // TODO : decide whether it is needed or not
            return balances.sort(function (a, b) { return a.asset.name > b.asset.name ? 1 : -1; });
        });
    });
    return Promise.all([wavesBalance, assetBalances])
        .then(function (_a) {
        var waves = _a[0], assets = _a[1];
        var array = waves.concat(assets);
        if (options.assets) {
            return _combiners_1.default.balanceListByAssets(array, options.assets);
        }
        else {
            return array; // TODO
        }
    });
}
exports.default = {
    get: function (address) {
        _warn_1.default();
        var balanceDetails = addresses_1.default.balanceDetails(address).then(function (data) {
            return schemas.detailedWavesBalanceSchema.parse(data);
        });
        var aliasesByAddress = aliases_1.default.byAddress(address).then(function (data) {
            return schemas.aliasesByAddressSchema.parse(data);
        });
        return Promise.all([
            balanceDetails,
            aliasesByAddress
        ]).then(function (_a) {
            var wavesBalance = _a[0], aliases = _a[1];
            return { wavesBalance: wavesBalance, aliases: aliases };
        });
    },
    balance: function (address, asset) {
        _warn_1.default();
        return getBalances(address, {
            assets: [asset]
        }).then(function (array) { return array[0]; });
    },
    balances: function (address, options) {
        if (options === void 0) { options = {}; }
        _warn_1.default();
        return getBalances(address, options);
    },
    transactions: function (address, options) {
        if (options === void 0) { options = {}; }
        _warn_1.default('This method is currently able to return only 1000 last transactions');
        // TODO : this method ignores `options.offset` parameter at the moment
        if (options.limit === 0) {
            // TODO : this is a temporary measure to not make useless identical requests
            options.limit = 2000;
        }
        return transactions_1.default.getList(address, options.limit).then(function (array) {
            if (options.type) {
                array = array.filter(_filters_1.default.transactionType(options.type));
            }
            if (options.sender) {
                array = array.filter(_filters_1.default.transactionSender(options.sender));
            }
            if (options.recipient) {
                array = array.filter(_filters_1.default.transactionRecipient(options.recipient));
            }
            return Promise.all(array.map(schemaTools_1.siftTransaction));
        });
    },
    utxTransactions: function (address) {
        _warn_1.default('This method may be switched off on the side of the Node');
        return transactions_1.default.utxGetList().then(function (array) {
            var filteredArray = array.filter(function (item) {
                return item.sender === address || item.recipient === address;
            });
            return Promise.all(filteredArray.map(schemaTools_1.siftTransaction));
        });
    },
    aliasList: function (address) {
        return aliases_1.default.byAddress(address).then(function (data) {
            return schemas.aliasesByAddressSchema.parse(data);
        });
    }
};
//# sourceMappingURL=addresses.js.map