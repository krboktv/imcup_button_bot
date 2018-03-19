"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("./libs/bignumber");
var Asset_1 = require("./classes/Asset");
var AssetPair_1 = require("./classes/AssetPair");
var Money_1 = require("./classes/Money");
var OrderPrice_1 = require("./classes/OrderPrice");
var Seed_1 = require("./classes/Seed");
var Transactions_1 = require("./classes/Transactions");
var byteProcessors = require("./classes/ByteProcessor");
var crypto_1 = require("./utils/crypto");
var request = require("./utils/request");
var storage = require("./utils/storage");
var NodeAPI = require("./api/node/index");
var MatcherAPI = require("./api/matcher/index");
var constants = require("./constants");
var config_1 = require("./config");
var tools_1 = require("./tools");
var WavesAPI = /** @class */ (function () {
    function WavesAPI(initialConfiguration) {
        this.Asset = Asset_1.default;
        this.AssetPair = AssetPair_1.default;
        this.Money = Money_1.default;
        this.OrderPrice = OrderPrice_1.default;
        this.Seed = Seed_1.default;
        this.Transactions = Transactions_1.default;
        this.byteProcessors = byteProcessors;
        this.config = config_1.default;
        this.constants = constants;
        this.crypto = crypto_1.default;
        this.request = request;
        this.storage = storage;
        this.tools = tools_1.default;
        this.API = {
            Node: {
                v1: NodeAPI.v1,
                v2: NodeAPI.v2
            },
            Matcher: {
                v1: MatcherAPI.v1
            }
        };
        if (this instanceof WavesAPI) {
            this.config.clear();
            this.config.set(initialConfiguration);
            if (WavesAPI._instance === null) {
                WavesAPI._instance = this;
            }
            else {
                return WavesAPI._instance;
            }
        }
        else {
            return new WavesAPI(initialConfiguration);
        }
    }
    return WavesAPI;
}());
exports.BigNumber = bignumber_1.default;
function create(config) {
    return new WavesAPI(config);
}
exports.create = create;
exports.MAINNET_CONFIG = constants.DEFAULT_MAINNET_CONFIG;
exports.TESTNET_CONFIG = constants.DEFAULT_TESTNET_CONFIG;
//# sourceMappingURL=WavesAPI.js.map