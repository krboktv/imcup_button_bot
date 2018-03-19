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
var base58_1 = require("../libs/base58");
var convert_1 = require("../utils/convert");
var concat_1 = require("../utils/concat");
var constants = require("../constants");
var config_1 = require("../config");
// NOTE : Waves asset ID in blockchain transactions equals to an empty string
function blockchainifyAssetId(assetId) {
    if (!assetId)
        throw new Error('Asset ID should not be empty');
    return assetId === constants.WAVES ? '' : assetId;
}
function getAliasBytes(alias) {
    var aliasBytes = convert_1.default.stringToByteArrayWithSize(alias);
    return [constants.ALIAS_VERSION, config_1.default.getNetworkByte()].concat(aliasBytes);
}
// ABSTRACT PARENT
var ByteProcessor = /** @class */ (function () {
    function ByteProcessor(name) {
        this.name = name;
    }
    return ByteProcessor;
}());
exports.ByteProcessor = ByteProcessor;
// SIMPLE
var Base58 = /** @class */ (function (_super) {
    __extends(Base58, _super);
    function Base58() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Base58.prototype.process = function (value) {
        var bytes = base58_1.default.decode(value);
        return Promise.resolve(bytes);
    };
    return Base58;
}(ByteProcessor));
exports.Base58 = Base58;
var Bool = /** @class */ (function (_super) {
    __extends(Bool, _super);
    function Bool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bool.prototype.process = function (value) {
        var bytes = convert_1.default.booleanToBytes(value);
        return Promise.resolve(Uint8Array.from(bytes));
    };
    return Bool;
}(ByteProcessor));
exports.Bool = Bool;
var Byte = /** @class */ (function (_super) {
    __extends(Byte, _super);
    function Byte() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Byte.prototype.process = function (value) {
        if (typeof value !== 'number')
            throw new Error('You should pass a number to Byte constructor');
        if (value < 0 || value > 255)
            throw new Error('Byte value must fit between 0 and 255');
        return Promise.resolve(Uint8Array.from([value]));
    };
    return Byte;
}(ByteProcessor));
exports.Byte = Byte;
var Long = /** @class */ (function (_super) {
    __extends(Long, _super);
    function Long() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Long.prototype.process = function (value) {
        var bytes = convert_1.default.longToByteArray(value);
        return Promise.resolve(Uint8Array.from(bytes));
    };
    return Long;
}(ByteProcessor));
exports.Long = Long;
var StringWithLength = /** @class */ (function (_super) {
    __extends(StringWithLength, _super);
    function StringWithLength() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringWithLength.prototype.process = function (value) {
        var bytesWithLength = convert_1.default.stringToByteArrayWithSize(value);
        return Promise.resolve(Uint8Array.from(bytesWithLength));
    };
    return StringWithLength;
}(ByteProcessor));
exports.StringWithLength = StringWithLength;
// COMPLEX
var Alias = /** @class */ (function (_super) {
    __extends(Alias, _super);
    function Alias() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Alias.prototype.process = function (value) {
        var aliasBytes = getAliasBytes(value);
        var aliasBytesWithLength = convert_1.default.bytesToByteArrayWithSize(aliasBytes);
        return Promise.resolve(Uint8Array.from(aliasBytesWithLength));
    };
    return Alias;
}(ByteProcessor));
exports.Alias = Alias;
var AssetId = /** @class */ (function (_super) {
    __extends(AssetId, _super);
    function AssetId() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AssetId.prototype.process = function (value) {
        value = blockchainifyAssetId(value);
        // We must pass bytes of `[0]` for Waves asset ID and bytes of `[1] + assetId` for other asset IDs
        var bytes = value ? concat_1.concatUint8Arrays(Uint8Array.from([1]), base58_1.default.decode(value)) : Uint8Array.from([0]);
        return Promise.resolve(bytes);
    };
    return AssetId;
}(ByteProcessor));
exports.AssetId = AssetId;
var Attachment = /** @class */ (function (_super) {
    __extends(Attachment, _super);
    function Attachment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Attachment.prototype.process = function (value) {
        if (typeof value === 'string') {
            value = Uint8Array.from(convert_1.default.stringToByteArray(value));
        }
        if (value.length > constants.TRANSFER_ATTACHMENT_BYTE_LIMIT) {
            throw new Error('Maximum attachment length is exceeded');
        }
        var valueWithLength = convert_1.default.bytesToByteArrayWithSize(value);
        return Promise.resolve(Uint8Array.from(valueWithLength));
    };
    return Attachment;
}(ByteProcessor));
exports.Attachment = Attachment;
var MandatoryAssetId = /** @class */ (function (_super) {
    __extends(MandatoryAssetId, _super);
    function MandatoryAssetId() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MandatoryAssetId.prototype.process = function (value) {
        value = blockchainifyAssetId(value);
        return Promise.resolve(base58_1.default.decode(value));
    };
    return MandatoryAssetId;
}(ByteProcessor));
exports.MandatoryAssetId = MandatoryAssetId;
var OrderType = /** @class */ (function (_super) {
    __extends(OrderType, _super);
    function OrderType() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderType.prototype.process = function (value) {
        if (value === 'buy') {
            return Bool.prototype.process.call(this, false);
        }
        else if (value === 'sell') {
            return Bool.prototype.process.call(this, true);
        }
        else {
            throw new Error('There are no other order types besides "buy" and "sell"');
        }
    };
    return OrderType;
}(ByteProcessor));
exports.OrderType = OrderType;
var Recipient = /** @class */ (function (_super) {
    __extends(Recipient, _super);
    function Recipient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Recipient.prototype.process = function (value) {
        if (value.length <= 30) {
            var aliasBytes = getAliasBytes(value);
            return Promise.resolve(Uint8Array.from(aliasBytes));
        }
        else {
            var addressBytes = base58_1.default.decode(value);
            return Promise.resolve(Uint8Array.from(addressBytes));
        }
    };
    return Recipient;
}(ByteProcessor));
exports.Recipient = Recipient;
//# sourceMappingURL=ByteProcessor.js.map