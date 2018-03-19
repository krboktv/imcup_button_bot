import { IPartialOptions } from 'ts-api-validator/src/interfaces';
import { IMoney } from '../classes/Money';
import { BasePart } from 'ts-api-validator';
export interface IMoneyPartOptions extends IPartialOptions<IMoney> {
    assetId?: string;
    assetIdPath?: string;
}
export declare class MoneyPart extends BasePart<IPartialOptions<IMoney>> {
    protected options: IMoneyPartOptions;
    private _data;
    process(data: any): Promise<any>;
    protected getValue(value: any): any;
}
