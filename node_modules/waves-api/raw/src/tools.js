"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var base58_1 = require("./libs/base58");
var crypto_1 = require("./utils/crypto");
var schemaTools_1 = require("./api/schemaTools");
exports.default = {
    getAddressFromPublicKey: function (publicKey) {
        var publicKeyBytes = base58_1.default.decode(publicKey);
        return crypto_1.default.buildRawAddress(publicKeyBytes);
    },
    base58: {
        encode: base58_1.default.encode,
        decode: base58_1.default.decode
    },
    siftTransaction: schemaTools_1.siftTransaction
};
//# sourceMappingURL=tools.js.map