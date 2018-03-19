"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var Storage = /** @class */ (function () {
    function Storage(init) {
        this._storages = Object.create(null);
        this._runInit = Object.create(null);
        this._when = Promise.resolve();
        this._init = init;
    }
    Object.defineProperty(Storage.prototype, "currentStorage", {
        get: function () {
            return this._resolveStorage();
        },
        enumerable: true,
        configurable: true
    });
    Storage.prototype.get = function (key) {
        var _this = this;
        return this._next(function () { return _this.currentStorage[key] || null; });
    };
    Storage.prototype.getAll = function () {
        var _this = this;
        return this._next(function () { return (__assign({}, _this.currentStorage)); });
    };
    Storage.prototype.getList = function () {
        return this.getAll().then(function (storage) {
            return Object.keys(storage).map(function (key) { return storage[key]; });
        });
    };
    Storage.prototype.set = function (key, value) {
        var _this = this;
        return this._next(function () {
            _this.currentStorage[key] = value;
            return value;
        });
    };
    Storage.prototype.clear = function () {
        var _this = this;
        return this._next(function () {
            _this._storages = Object.create(null);
            _this._runInit = Object.create(null);
            _this._when = Promise.resolve();
        });
    };
    Storage.prototype._next = function (callback) {
        var _this = this;
        var network = config_1.default.getNetworkByte();
        if (this._init && !this._runInit[network]) {
            this._runInit[network] = true;
            this._when = this._when.then(function () {
                return _this._init(function (key, value) {
                    _this.currentStorage[key] = value;
                });
            });
        }
        this._when = this._when.then(callback || (function () { return null; }));
        return this._when;
    };
    Storage.prototype._resolveStorage = function () {
        var network = config_1.default.getNetworkByte();
        if (!this._storages[network]) {
            this._storages[network] = Object.create(null);
        }
        return this._storages[network];
    };
    return Storage;
}());
function getStorage(init) {
    return new Storage(init);
}
exports.getStorage = getStorage;
//# sourceMappingURL=storage.js.map