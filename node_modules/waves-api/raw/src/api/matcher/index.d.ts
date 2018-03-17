import { IHash, IKeyPair } from '../../../interfaces';
export interface IMatcherAPIv1 {
    getMatcherKey(): Promise<any>;
    getOrderbooks(): Promise<any>;
    getOrderbook(assetOne: string, assetTwo: string): Promise<any>;
    getOrders(assetOne: string, assetTwo: string, keyPair: IKeyPair): Promise<any>;
    getAllOrders(keyPair: IKeyPair): Promise<any>;
    createOrder(data: IHash<any>, keyPair: IKeyPair): IHash<any>;
    cancelOrder(amountAssetId: string, priceAssetId: string, orderId: string, keyPair: IKeyPair): IHash<any>;
    deleteOrder(amountAssetId: string, priceAssetId: string, orderId: string, keyPair: IKeyPair): IHash<any>;
}
export declare const v1: IMatcherAPIv1;
