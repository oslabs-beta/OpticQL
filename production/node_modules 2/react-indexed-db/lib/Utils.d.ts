export interface Options {
    storeName: string;
    dbMode: IDBTransactionMode;
    error: (e: Event) => any;
    complete: (e: Event) => any;
    abort?: any;
}
export declare function validateStoreName(db: IDBDatabase, storeName: string): boolean;
export declare function validateBeforeTransaction(db: IDBDatabase, storeName: string, reject: Function): void;
export declare function createTransaction(db: IDBDatabase, options: Options): IDBTransaction;
export declare function optionsGenerator(type: any, storeName: any, reject: Function, resolve: Function): Options;
