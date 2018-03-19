"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_api_validator_1 = require("ts-api-validator");
var schema_MoneyPart_1 = require("../../schema.MoneyPart");
var constants = require("../../../constants");
var remap_1 = require("../../../utils/remap");
var schemaTemporaryTools_1 = require("../../schemaTemporaryTools");
exports.detailedWavesBalanceSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ObjectPart,
    required: true,
    content: {
        regular: {
            // The amount one have
            type: schema_MoneyPart_1.MoneyPart,
            assetId: constants.WAVES,
            parseValue: schemaTemporaryTools_1.stringConversion
        },
        available: {
            // Available to spend
            type: schema_MoneyPart_1.MoneyPart,
            assetId: constants.WAVES,
            parseValue: schemaTemporaryTools_1.stringConversion
        },
        effective: {
            // Potential leasing balance
            type: schema_MoneyPart_1.MoneyPart,
            assetId: constants.WAVES,
            parseValue: schemaTemporaryTools_1.stringConversion
        },
        generating: {
            // Actual leasing balance
            type: schema_MoneyPart_1.MoneyPart,
            assetId: constants.WAVES,
            parseValue: schemaTemporaryTools_1.stringConversion
        },
        leasedOut: {
            // Leased to another account
            type: schema_MoneyPart_1.MoneyPart,
            assetId: constants.WAVES,
            // TODO : remove in the new API
            path: null,
            parseValue: function (o) {
                return schemaTemporaryTools_1.stringConversion(o.regular - o.available);
            }
        },
        leasedIn: {
            // Incoming leasing
            type: schema_MoneyPart_1.MoneyPart,
            assetId: constants.WAVES,
            // TODO : remove in the new API
            path: null,
            parseValue: function (o) {
                return schemaTemporaryTools_1.stringConversion(o.effective - o.available);
            }
        }
    }
});
exports.aliasesByAddressSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ArrayPart,
    required: true,
    content: {
        type: ts_api_validator_1.StringPart,
        parseValue: remap_1.removeAliasPrefix
    }
});
exports.assetBalancesSchema = new ts_api_validator_1.Schema({
    type: ts_api_validator_1.ArrayPart,
    required: true,
    path: 'balances',
    content: {
        type: schema_MoneyPart_1.MoneyPart,
        required: true,
        path: 'balance',
        assetIdPath: 'assetId',
        parseValue: schemaTemporaryTools_1.stringConversion
    }
});
//# sourceMappingURL=addresses.x.js.map