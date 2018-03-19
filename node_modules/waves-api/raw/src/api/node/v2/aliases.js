"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aliases_1 = require("../v1/aliases");
var schemas = require("./aliases.x");
exports.default = {
    getAddress: function (alias) {
        return aliases_1.default.byAlias(alias).then(function (data) {
            return schemas.aliasAddressSchema.parse(data);
        });
    }
};
//# sourceMappingURL=aliases.js.map