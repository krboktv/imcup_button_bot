import { BooleanPart, NumberPart, StringPart } from 'ts-api-validator';
declare const _default: {
    publicKey: {
        type: typeof StringPart;
        required: boolean;
    };
    assetId: {
        type: typeof StringPart;
        required: boolean;
    };
    fee: {
        type: typeof NumberPart;
        required: boolean;
        defaultValue: number;
    };
    issueFee: {
        type: typeof NumberPart;
        required: boolean;
        defaultValue: number;
    };
    matcherFee: {
        type: typeof NumberPart;
        required: boolean;
        defaultValue: number;
    };
    recipient: {
        type: typeof StringPart;
        required: boolean;
        parseValue: (original: any) => any;
    };
    reissuable: {
        type: typeof BooleanPart;
        required: boolean;
        defaultValue: boolean;
    };
    timestamp: {
        type: typeof NumberPart;
        required: boolean;
        parseValue: (timestamp: any) => any;
    };
};
export default _default;
