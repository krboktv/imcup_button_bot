"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var addresses_1 = require("./v1/addresses");
var aliases_1 = require("./v1/aliases");
var assets_1 = require("./v1/assets");
var blocks_1 = require("./v1/blocks");
var leasing_1 = require("./v1/leasing");
var transactions_1 = require("./v1/transactions");
var addresses_2 = require("./v2/addresses");
var aliases_2 = require("./v2/aliases");
var transactions_2 = require("./v2/transactions");
exports.v1 = {
    addresses: addresses_1.default,
    aliases: aliases_1.default,
    assets: assets_1.default,
    blocks: blocks_1.default,
    leasing: leasing_1.default,
    transactions: transactions_1.default
};
exports.v2 = {
    addresses: addresses_2.default,
    aliases: aliases_2.default,
    transactions: transactions_2.default
};
//# sourceMappingURL=index.js.map