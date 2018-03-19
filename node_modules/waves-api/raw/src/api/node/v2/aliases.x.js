"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
exports.aliasAddressSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        address: {
            type: ts_api_validator_1.StringPart,
            required: true
        }
    }
});
//# sourceMappingURL=aliases.x.js.map