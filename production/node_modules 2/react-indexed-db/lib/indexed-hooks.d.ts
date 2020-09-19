import { Key } from './indexed-db';
export interface IndexedDBProps {
    name: string;
    version: number;
    objectStoresMeta: ObjectStoreMeta[];
}
export interface ObjectStoreMeta {
    store: string;
    storeConfig: {
        keyPath: string;
        autoIncrement: boolean;
        [key: string]: any;
    };
    storeSchema: ObjectStoreSchema[];
}
export interface ObjectStoreSchema {
    name: string;
    keypath: string;
    options: {
        unique: boolean;
        [key: string]: any;
    };
}
export interface useIndexedDB {
    dbName: string;
    version: number;
    objectStore: string;
}
export declare function initDB({ name, version, objectStoresMeta }: IndexedDBProps): void;
export declare function useIndexedDB(objectStore: string): {
    add: <T = any>(value: T, key?: any) => Promise<number>;
    getByID: <T = any>(id: number | string) => Promise<T>;
    getAll: <T = any>() => Promise<T[]>;
    update: <T = any>(value: T, key?: any) => Promise<any>;
    deleteRecord: (key: Key) => Promise<any>;
    openCursor: (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
    getByIndex: (indexName: string, key: any) => Promise<any>;
    clear: () => Promise<any>;
};
