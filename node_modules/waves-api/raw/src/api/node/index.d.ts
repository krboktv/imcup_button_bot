import { IAPIBalanceOptions, IAPITransactionsOptions, IHash, IKeyPair } from '../../../interfaces';
export interface INodeAPIv1 {
    addresses: {
        balance(address: string, confirmations?: number): Promise<any>;
        balanceDetails(address: string): Promise<any>;
    };
    aliases: {
        byAlias(alias: string): Promise<any>;
        byAddress(address: string): Promise<any>;
        createAlias(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
    };
    assets: {
        balances(address: string): Promise<any>;
        balance(address: string, assetId: string): Promise<any>;
        distribution(assetId: string): Promise<any>;
        issue(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
        transfer(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
        reissue(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
        burn(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
    };
    blocks: {
        get(signature: string): Promise<any>;
        at(height: number): Promise<any>;
        first(): Promise<any>;
        last(): Promise<any>;
        height(): Promise<any>;
    };
    leasing: {
        lease(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
        cancelLeasing(data: IHash<any>, keyPair: IKeyPair): Promise<any>;
    };
    transactions: {
        get(id: string): Promise<any>;
        getList(address: string): Promise<any>;
        utxSize(): Promise<any>;
        utxGet(id: string): Promise<any>;
        utxGetList(): Promise<any>;
    };
}
export declare const v1: INodeAPIv1;
export interface INodeAPIv2 {
    addresses: {
        get(address: string): Promise<any>;
        balance(address: string, asset: string): Promise<any>;
        balances(address: string, options: IAPIBalanceOptions): Promise<any>;
        transactions(address: string, options: IAPITransactionsOptions): Promise<any>;
        utxTransactions(address: string): Promise<any>;
        aliasList(address: string): Promise<any>;
    };
    aliases: {
        getAddress(alias: string): Promise<any>;
    };
    transactions: {
        get(id: string): Promise<any>;
    };
}
export declare const v2: INodeAPIv2;
