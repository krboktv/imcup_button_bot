"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
var remap_1 = require("../../../utils/remap");
var constants = require("../../../constants");
exports.createAliasSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        senderPublicKey: {
            type: ts_api_validator_1.StringPart,
            required: true
        },
        alias: {
            type: ts_api_validator_1.StringPart,
            required: true,
            parseValue: remap_1.removeAliasPrefix
        },
        fee: {
            type: ts_api_validator_1.NumberPart,
            required: false,
            defaultValue: constants.MINIMUM_FEE
        },
        timestamp: {
            type: ts_api_validator_1.NumberPart,
            required: true,
            parseValue: remap_1.getTimestamp
        }
    }
});
//# sourceMappingURL=aliases.x.js.map