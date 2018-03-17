declare const _default: {
    get(id: string): Promise<any>;
    getList(address: string, limit?: number): Promise<any>;
    utxSize(): Promise<any>;
    utxGet(id: string): Promise<any>;
    utxGetList(): Promise<any>;
};
export default _default;
