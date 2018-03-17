import { IKeyPairBytes } from '../../interfaces';
declare const _default: {
    buildTransactionSignature(dataBytes: Uint8Array, privateKey: string): string;
    buildTransactionId(dataBytes: Uint8Array): string;
    buildKeyPair(seed: string): IKeyPairBytes;
    buildRawAddress(publicKeyBytes: Uint8Array): string;
    encryptSeed(seed: string, password: string, encryptionRounds?: number): string;
    decryptSeed(encryptedSeed: string, password: string, encryptionRounds?: number): string;
    generateRandomUint32Array(length: number): Uint32Array;
};
export default _default;
