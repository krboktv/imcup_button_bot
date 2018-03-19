import { IHash } from '../../interfaces';
export interface IStorage {
    get(key: string): Promise<any>;
    getAll(): Promise<IHash<any>>;
    getList(): Promise<Array<any>>;
    set(key: string, value: any): Promise<typeof value>;
    clear(): Promise<void>;
}
export declare function getStorage(init?: any): IStorage;
