import { IHash, IWavesConfig } from '../interfaces';
declare const _default: {
    getNetworkByte(): number;
    getNodeAddress(): string;
    getMatcherAddress(): string;
    getMinimumSeedLength(): number;
    getRequestParams(): IHash<any>;
    getAssetFactory(): Function;
    getLogLevel(): "error" | "none" | "warning" | "info";
    get(): {
        networkByte: number;
        nodeAddress: string;
        matcherAddress: string;
        assetFactory?: Function;
        minimumSeedLength: number;
        requestOffset: number;
        requestLimit: number;
        logLevel: "error" | "none" | "warning" | "info";
    };
    set(newConfig: Partial<IWavesConfig>): void;
    clear(): void;
};
export default _default;
