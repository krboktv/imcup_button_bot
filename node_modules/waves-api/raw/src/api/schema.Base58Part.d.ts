import { IPartialOptions } from 'ts-api-validator/src/interfaces';
import { BasePart } from 'ts-api-validator';
export interface IBase58Part extends IPartialOptions<string> {
    type: typeof Base58Part;
}
export declare class Base58Part extends BasePart<IBase58Part> {
    protected getValue(value?: string): string;
}
