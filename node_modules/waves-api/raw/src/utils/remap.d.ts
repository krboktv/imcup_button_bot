import { IHash } from '../../interfaces';
export declare function normalizeAssetId(original: any): any;
export declare function denormalizeAssetId(original: any): any;
export declare function removeRecipientPrefix(original: any): any;
export declare function removeAliasPrefix(original: any): any;
export declare function getTimestamp(timestamp: any): any;
export declare function precisionCheck(precision: any): boolean;
export declare function createRemapper(rules: any): (data: IHash<any>) => IHash<any>;
