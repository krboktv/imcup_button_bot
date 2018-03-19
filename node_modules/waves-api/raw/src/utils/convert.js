"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var converters_1 = require("../libs/converters");
exports.default = {
    booleanToBytes: function (input) {
        if (typeof input !== 'boolean') {
            throw new Error('Boolean input is expected');
        }
        return input ? [1] : [0];
    },
    bytesToByteArrayWithSize: function (input) {
        if (!(input instanceof Array || input instanceof Uint8Array)) {
            throw new Error('Byte array or Uint8Array input is expected');
        }
        else if (input instanceof Array && !(input.every(function (n) { return typeof n === 'number'; }))) {
            throw new Error('Byte array contains non-numeric elements');
        }
        if (!(input instanceof Array)) {
            input = Array.prototype.slice.call(input);
        }
        var lengthBytes = converters_1.default.int16ToBytes(input.length, true);
        return lengthBytes.concat(input);
    },
    longToByteArray: function (input) {
        if (typeof input !== 'number') {
            throw new Error('Numeric input is expected');
        }
        var bytes = new Array(7);
        for (var k = 7; k >= 0; k--) {
            bytes[k] = input & (255);
            input = input / 256;
        }
        return bytes;
    },
    stringToByteArray: function (input) {
        if (typeof input !== 'string') {
            throw new Error('String input is expected');
        }
        return converters_1.default.stringToByteArray(input);
    },
    stringToByteArrayWithSize: function (input) {
        if (typeof input !== 'string') {
            throw new Error('String input is expected');
        }
        var stringBytes = converters_1.default.stringToByteArray(input);
        var lengthBytes = converters_1.default.int16ToBytes(stringBytes.length, true);
        return lengthBytes.concat(stringBytes);
    }
};
//# sourceMappingURL=convert.js.map