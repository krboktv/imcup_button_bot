import { TTransactionRequest } from '../../../utils/request';
declare const _default: {
    balances(address: string): Promise<any>;
    balance(address: string, assetId: string): Promise<any>;
    distribution(assetId: string): Promise<any>;
    issue: TTransactionRequest;
    transfer: TTransactionRequest;
    reissue: TTransactionRequest;
    burn: TTransactionRequest;
};
export default _default;
