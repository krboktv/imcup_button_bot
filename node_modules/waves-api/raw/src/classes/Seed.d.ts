import { IKeyPair } from '../../interfaces';
export interface ISeed {
    readonly phrase: string;
    readonly address: string;
    readonly keyPair: IKeyPair;
    encrypt(password: string, encryptionRounds?: number): any;
}
declare const _default: {
    create(words?: number): ISeed;
    fromExistingPhrase(phrase: string): ISeed;
    encryptSeedPhrase: (seedPhrase: string, password: string, encryptionRounds?: number) => string;
    decryptSeedPhrase: (encryptedSeedPhrase: string, password: string, encryptionRounds?: number) => any;
};
export default _default;
