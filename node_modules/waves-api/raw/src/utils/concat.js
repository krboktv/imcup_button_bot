"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function concatUint8Arrays() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (args.length < 2) {
        throw new Error('Two or more Uint8Array are expected');
    }
    if (!(args.every(function (arg) { return arg instanceof Uint8Array; }))) {
        throw new Error('One of arguments is not a Uint8Array');
    }
    var count = args.length;
    var sumLength = args.reduce(function (sum, arr) { return sum + arr.length; }, 0);
    var result = new Uint8Array(sumLength);
    var curLength = 0;
    for (var i = 0; i < count; i++) {
        result.set(args[i], curLength);
        curLength += args[i].length;
    }
    return result;
}
exports.concatUint8Arrays = concatUint8Arrays;
//# sourceMappingURL=concat.js.map