import { IHash } from '../../interfaces';
import { IAsset } from './Asset';
export interface IAssetPair {
    amountAsset: IAsset;
    priceAsset: IAsset;
    precisionDifference: number;
    toJSON(): IHash<any>;
    toString(): string;
}
declare const _default: {
    get(assetOne: string | IAsset, assetTwo: string | IAsset): Promise<IAssetPair>;
    clearCache(): Promise<void>;
    isAssetPair(object: any): boolean;
};
export default _default;
