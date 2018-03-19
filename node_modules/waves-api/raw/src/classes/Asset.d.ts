import { IAssetObject, IHash } from '../../interfaces';
export interface IAsset extends IAssetObject {
    toJSON(): IHash<any>;
    toString(): string;
}
export default class Asset implements IAsset {
    readonly id: any;
    readonly name: any;
    readonly precision: any;
    readonly description: any;
    private static _storage;
    protected constructor(props: IAssetObject);
    toJSON(): {
        id: any;
        name: any;
        precision: any;
        description: any;
    };
    toString(): any;
    static get(input: IAsset | IAssetObject | string): Promise<any>;
    static getKnownAssets(): Promise<IHash<any>>;
    static getKnownAssetsList(): Promise<any[]>;
    static clearCache(): Promise<void>;
    static isAsset(object: any): boolean;
    private static _factory(props);
    private static _defaultFactory(props);
}
