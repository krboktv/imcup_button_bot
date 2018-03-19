import { IAPIBalanceOptions, IAPITransactionsOptions } from '../../../../interfaces';
import Money from '../../../classes/Money';
declare const _default: {
    get(address: any): Promise<{
        wavesBalance: any;
        aliases: any;
    }>;
    balance(address: any, asset: any): Promise<Money>;
    balances(address: any, options?: IAPIBalanceOptions): Promise<Money[]>;
    transactions(address: any, options?: IAPITransactionsOptions): Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    utxTransactions(address: any): Promise<[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]>;
    aliasList(address: any): Promise<any>;
};
export default _default;
