import { IHash, IWavesConfig } from '../interfaces';
import { ITransactionClassConstructor } from './classes/Transactions';
import BigNumberLibrary from './libs/bignumber';
import Seed from './classes/Seed';
import * as byteProcessors from './classes/ByteProcessor';
import { INodeAPIv1, INodeAPIv2 } from './api/node/index';
import { IMatcherAPIv1 } from './api/matcher/index';
export interface IAPIVersions {
    Node: {
        v1: INodeAPIv1;
        v2: INodeAPIv2;
    };
    Matcher: {
        v1: IMatcherAPIv1;
    };
}
export interface IWavesAPI {
    Asset: any;
    AssetPair: any;
    Money: any;
    OrderPrice: any;
    Seed: typeof Seed;
    Transactions: IHash<ITransactionClassConstructor | Function>;
    byteProcessors: typeof byteProcessors;
    constants: IHash<any>;
    crypto: IHash<any>;
    request: IHash<any>;
    storage: IHash<any>;
    tools: IHash<any>;
    API: IAPIVersions;
}
export declare const BigNumber: typeof BigNumberLibrary;
export declare function create(config: IWavesConfig): IWavesAPI;
export declare const MAINNET_CONFIG: IWavesConfig;
export declare const TESTNET_CONFIG: IWavesConfig;
