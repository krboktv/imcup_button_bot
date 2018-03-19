import { IKeyPair } from '../../../../interfaces';
import { TTransactionRequest } from '../../../utils/request';
declare const _default: {
    getOrderbooks(): Promise<any>;
    getOrderbook(assetOne: string, assetTwo: string): Promise<any>;
    getOrders(assetOne: string, assetTwo: string, keyPair: IKeyPair): Promise<any>;
    getAllOrders(keyPair: IKeyPair): Promise<any>;
    createOrder: TTransactionRequest;
    cancelOrder: (amountAssetId: string, priceAssetId: string, orderId: string, keyPair: IKeyPair) => Promise<any>;
    deleteOrder: (amountAssetId: string, priceAssetId: string, orderId: string, keyPair: IKeyPair) => Promise<any>;
};
export default _default;
