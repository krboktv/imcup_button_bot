"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var storage_1 = require("../utils/storage");
var constants_1 = require("../constants");
var config_1 = require("../config");
/** TEMPORARY MOCKS */
var index_1 = require("../api/node/index");
function getAssetProps(id) {
    return index_1.v1.transactions.get(id).then(function (assetTransaction) { return ({
        id: id,
        name: assetTransaction.name,
        precision: assetTransaction.decimals,
        description: assetTransaction.description || ''
    }); });
}
function checkAssetProps(props) {
    if (!props.id) {
        throw new Error('An attempt to create Asset without ID');
    }
    if (!props.name) {
        throw new Error('An attempt to create Asset without a name');
    }
    if (typeof props.precision !== 'number' || props.precision < 0 || props.precision > 8) {
        throw new Error("An attempt to create Asset with wrong precision (" + props.precision + ")");
    }
}
var Asset = /** @class */ (function () {
    function Asset(props) {
        this.id = props.id;
        this.name = props.name;
        this.precision = props.precision;
        this.description = props.description || '';
    }
    Asset.prototype.toJSON = function () {
        return {
            id: this.id,
            name: this.name,
            precision: this.precision,
            description: this.description
        };
    };
    Asset.prototype.toString = function () {
        return this.id;
    };
    Asset.get = function (input) {
        if (Asset.isAsset(input)) {
            return Promise.resolve(input);
        }
        else if (typeof input === 'string') {
            var id_1 = input;
            return Asset._storage.get(id_1).then(function (asset) {
                return asset || getAssetProps(id_1).then(function (props) {
                    return Asset._factory(props);
                }).then(function (newAsset) {
                    return Asset._storage.set(newAsset.id, newAsset);
                });
            });
        }
        else {
            var props_1 = input;
            return Asset._storage.get(props_1.id).then(function (asset) {
                return asset || Asset._factory(props_1).then(function (newAsset) {
                    return Asset._storage.set(newAsset.id, newAsset);
                });
            });
        }
    };
    Asset.getKnownAssets = function () {
        return Asset._storage.getAll();
    };
    Asset.getKnownAssetsList = function () {
        return Asset._storage.getList();
    };
    Asset.clearCache = function () {
        return Asset._storage.clear();
    };
    Asset.isAsset = function (object) {
        return object instanceof Asset;
    };
    Asset._factory = function (props) {
        checkAssetProps(props);
        var factory = config_1.default.getAssetFactory() || Asset._defaultFactory;
        return factory(props).then(function (asset) {
            if (!Asset.isAsset(asset)) {
                throw new Error("Factory provided an object which is not a heir of Asset");
            }
            return asset;
        });
    };
    Asset._defaultFactory = function (props) {
        var asset = new Asset(props);
        return Promise.resolve(asset);
    };
    Asset._storage = storage_1.getStorage(function (set) {
        return Asset._factory(constants_1.WAVES_PROPS).then(function (wavesAsset) {
            set(wavesAsset.id, wavesAsset);
        });
    });
    return Asset;
}());
exports.default = Asset;
//# sourceMappingURL=Asset.js.map