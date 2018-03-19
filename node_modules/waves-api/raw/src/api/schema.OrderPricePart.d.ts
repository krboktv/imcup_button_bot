import { IPartialOptions } from 'ts-api-validator/src/interfaces';
import { IOrderPrice } from '../classes/OrderPrice';
import { BasePart } from 'ts-api-validator';
export interface IOrderPricePartOptions extends IPartialOptions<IOrderPrice> {
    amountAssetId?: string;
    amountAssetIdPath?: string;
    priceAssetId?: string;
    priceAssetIdPath?: string;
}
export declare class OrderPricePart extends BasePart<IPartialOptions<IOrderPrice>> {
    protected options: IOrderPricePartOptions;
    private _data;
    process(data: any): Promise<any>;
    protected getValue(value: any): any;
}
