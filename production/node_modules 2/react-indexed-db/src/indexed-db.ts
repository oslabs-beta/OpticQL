import { validateBeforeTransaction, createTransaction, optionsGenerator } from './Utils';
import { ObjectStoreMeta, ObjectStoreSchema } from './indexed-hooks';

export type Key = string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange;
export interface IndexDetails {
  indexName: string;
  order: string;
}
const indexedDB: IDBFactory =
  window.indexedDB || (<any>window).mozIndexedDB || (<any>window).webkitIndexedDB || (<any>window).msIndexedDB;

export function openDatabase(dbName: string, version: number, upgradeCallback?: Function) {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    let db: IDBDatabase;
    request.onsuccess = (event: Event) => {
      db = request.result;
      resolve(db);
    };
    request.onerror = (event: Event) => {
      reject(`IndexedDB error: ${request.error}`);
    };
    if (typeof upgradeCallback === 'function') {
      request.onupgradeneeded = (event: Event) => {
        upgradeCallback(event, db);
      };
    }
  });
}

export function CreateObjectStore(dbName: string, version: number, storeSchemas: ObjectStoreMeta[]) {
  const request: IDBOpenDBRequest = indexedDB.open(dbName, version);

  request.onupgradeneeded = function(event: IDBVersionChangeEvent) {
    const database: IDBDatabase = (event.target as any).result;
    storeSchemas.forEach((storeSchema: ObjectStoreMeta) => {
      if (!database.objectStoreNames.contains(storeSchema.store)) {
        const objectStore = database.createObjectStore(storeSchema.store, storeSchema.storeConfig);
        storeSchema.storeSchema.forEach((schema: ObjectStoreSchema) => {
          objectStore.createIndex(schema.name, schema.keypath, schema.options);
        });
      }
    });
    database.close();
  };
  request.onsuccess = function(e: any) {
    e.target.result.close();
  };
}

export function DBOperations(dbName: string, version: number, currentStore: string) {
  return {
    add<T>(value: T, key?: any) {
      return new Promise<number>((resolve, reject) => {
        openDatabase(dbName, version).then((db: IDBDatabase) => {
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          let request = objectStore.add(value, key);
          request.onsuccess = (evt: any) => {
            key = evt.target.result;
            resolve(key);
          };
        });
      });
    },
    getByID<T>(id: string | number) {
      return new Promise<T>((resolve, reject) => {
        openDatabase(dbName, version).then((db: IDBDatabase) => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            request: IDBRequest;
          request = objectStore.get(+id);
          request.onsuccess = function(event: Event) {
            resolve((event.target as any).result as T);
          };
        });
      });
    },
    getAll<T>() {
      return new Promise<T[]>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            result: Array<any> = [];

          const request: IDBRequest = objectStore.getAll();

          request.onerror = function(e) {
            reject(e);
          };

          request.onsuccess = function({ target: { result } }: any) {
            resolve(result as T[]);
          };
        });
      });
    },
    update<T>(value: T, key?: any) {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          transaction.oncomplete = event => {
            resolve(event);
          };
          objectStore.put(value, key);
        });
      });
    },
    deleteRecord(key: Key) {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          let request = objectStore.delete(key);
          request.onsuccess = event => {
            resolve(event);
          };
        });
      });
    },
    clear() {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readwrite, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore);
          objectStore.clear();
          transaction.oncomplete = event => {
            resolve();
          };
        });
      });
    },
    openCursor(cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) {
      return new Promise<void>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            request = objectStore.openCursor(keyRange);

          request.onsuccess = (event: Event) => {
            cursorCallback(event);
            resolve();
          };
        });
      });
    },
    getByIndex(indexName: string, key: any) {
      return new Promise<any>((resolve, reject) => {
        openDatabase(dbName, version).then(db => {
          validateBeforeTransaction(db, currentStore, reject);
          let transaction = createTransaction(db, optionsGenerator(DBMode.readonly, currentStore, reject, resolve)),
            objectStore = transaction.objectStore(currentStore),
            index = objectStore.index(indexName),
            request = index.get(key);
          request.onsuccess = (event: Event) => {
            resolve((<IDBOpenDBRequest>event.target).result);
          };
        });
      });
    }
  };
}

export enum DBMode {
  readonly = 'readonly',
  readwrite = 'readwrite'
}
