import { IHash, IKeyPair } from '../../interfaces';
import { ITransactionClassConstructor } from '../classes/Transactions';
export declare type TTransactionRequest = (data: IHash<any>, keyPair: IKeyPair) => Promise<any>;
export interface IFetchWrapper<T> {
    (path: string, options?: IHash<any>): Promise<T>;
}
export declare const enum PRODUCTS {
    NODE = 0,
    MATCHER = 1,
}
export declare const enum VERSIONS {
    V1 = 0,
}
export declare const POST_TEMPLATE: {
    method: string;
    headers: {
        'Accept': string;
        'Content-Type': string;
    };
};
export declare function normalizeHost(host: any): string;
export declare function normalizePath(path: any): string;
export declare function processJSON(res: any): any;
export declare function createFetchWrapper(product: PRODUCTS, version: VERSIONS, pipe?: Function): IFetchWrapper<any>;
export declare function wrapTransactionRequest(TransactionConstructor: ITransactionClassConstructor, preRemapAsync: (data: IHash<any>) => Promise<IHash<any>>, postRemap: (data: IHash<any>) => IHash<any>, callback: (postParams: IHash<any>) => Promise<any>): (data: IHash<any>, keyPair: IKeyPair) => Promise<any>;
