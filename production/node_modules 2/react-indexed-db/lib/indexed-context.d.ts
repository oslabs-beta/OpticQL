import { ReactNode } from 'react';
import { Key } from './indexed-db';
interface IndexedDBProps {
    name: string;
    version: number;
    children: ReactNode;
    objectStoresMeta: ObjectStoreMeta[];
}
interface ObjectStoreMeta {
    store: string;
    storeConfig: {
        keyPath: string;
        autoIncrement: boolean;
        [key: string]: any;
    };
    storeSchema: ObjectStoreSchema[];
}
interface ObjectStoreSchema {
    name: string;
    keypath: string;
    options: {
        unique: boolean;
        [key: string]: any;
    };
}
export declare function IndexedDB({ name, version, children, objectStoresMeta }: IndexedDBProps): JSX.Element;
interface AccessDBProps {
    children: ({ db }: {
        db: IDBDatabase;
        add: <T = any>(value: T, key?: any) => Promise<number>;
        getByID: <T = any>(id: number | string) => Promise<T>;
        getAll: <T = any>() => Promise<T[]>;
        update: <T = any>(value: T, key?: any) => Promise<any>;
        deleteRecord: (key: Key) => Promise<any>;
        openCursor: (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
        getByIndex: (indexName: string, key: any) => Promise<any>;
        clear: () => Promise<any>;
    }) => {};
    objectStore: string;
}
export declare function AccessDB({ children, objectStore }: AccessDBProps): JSX.Element;
export {};
