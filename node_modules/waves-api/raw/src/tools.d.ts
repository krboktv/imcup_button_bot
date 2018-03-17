declare const _default: {
    getAddressFromPublicKey(publicKey: string): string;
    base58: {
        encode: (buffer: number[] | Uint8Array) => string;
        decode: (string: any) => Uint8Array;
    };
    siftTransaction: (transaction: any) => Promise<any>;
};
export default _default;
