import { IHash } from '../../interfaces';
import { IAsset } from './Asset';
import { IAssetPair } from './AssetPair';
import BigNumber from '../libs/bignumber';
export interface IOrderPrice {
    pair: IAssetPair;
    getMatcherCoins(): BigNumber;
    getTokens(): BigNumber;
    toMatcherCoins(): string;
    toTokens(): string;
    toFormat(): string;
    toJSON(): IHash<any>;
    toString(): string;
}
export default class OrderPrice implements IOrderPrice {
    readonly pair: IAssetPair;
    private _matcherCoins;
    private _tokens;
    private static _MATCHER_SCALE;
    private constructor();
    getMatcherCoins(): BigNumber;
    getTokens(): BigNumber;
    toMatcherCoins(): string;
    toTokens(): string;
    toFormat(): string;
    toJSON(): {
        amountAssetId: string;
        priceAssetId: string;
        priceTokens: string;
    };
    toString(): string;
    static fromTokens(tokens: any, pair: IAssetPair | IAsset | string, secondAsset?: IAsset | string): Promise<IOrderPrice>;
    static fromMatcherCoins(coins: any, pair: IAssetPair | IAsset | string, secondAsset?: IAsset | string): Promise<IOrderPrice>;
    static isOrderPrice(object: any): boolean;
    private static _checkAmount(amount);
    private static _getPair(pair, secondAsset);
    private static _getMatcherDivider(precision);
}
