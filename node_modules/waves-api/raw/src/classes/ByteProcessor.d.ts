export declare abstract class ByteProcessor {
    readonly name: string;
    constructor(name: string);
    abstract process(value: any): Promise<Uint8Array>;
}
export declare class Base58 extends ByteProcessor {
    process(value: string): Promise<Uint8Array>;
}
export declare class Bool extends ByteProcessor {
    process(value: boolean): Promise<Uint8Array>;
}
export declare class Byte extends ByteProcessor {
    process(value: number): Promise<Uint8Array>;
}
export declare class Long extends ByteProcessor {
    process(value: number): Promise<Uint8Array>;
}
export declare class StringWithLength extends ByteProcessor {
    process(value: string): Promise<Uint8Array>;
}
export declare class Alias extends ByteProcessor {
    process(value: string): Promise<Uint8Array>;
}
export declare class AssetId extends ByteProcessor {
    process(value: string): Promise<Uint8Array>;
}
export declare class Attachment extends ByteProcessor {
    process(value: Uint8Array | string): Promise<Uint8Array>;
}
export declare class MandatoryAssetId extends ByteProcessor {
    process(value: string): Promise<Uint8Array>;
}
export declare class OrderType extends ByteProcessor {
    process(value: string): any;
}
export declare class Recipient extends ByteProcessor {
    process(value: string): Promise<Uint8Array>;
}
