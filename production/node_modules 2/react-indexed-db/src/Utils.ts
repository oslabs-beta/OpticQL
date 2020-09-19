export interface Options {
  storeName: string;
  dbMode: IDBTransactionMode;
  error: (e: Event) => any;
  complete: (e: Event) => any;
  abort?: any;
}

export function validateStoreName(db: IDBDatabase, storeName: string) {
  return db.objectStoreNames.contains(storeName);
}

export function validateBeforeTransaction(db: IDBDatabase, storeName: string, reject: Function) {
  if (!db) {
    reject('You need to use the openDatabase function to create a database before you query it!');
  }
  if (!validateStoreName(db, storeName)) {
    reject(`objectStore does not exists: ${storeName}`);
  }
}

export function createTransaction(db: IDBDatabase, options: Options): IDBTransaction {
  let trans: IDBTransaction = db.transaction(options.storeName, options.dbMode);
  trans.onerror = options.error;
  trans.oncomplete = options.complete;
  trans.onabort = options.abort;
  return trans;
}

export function optionsGenerator(type: any, storeName: any, reject: Function, resolve: Function): Options {
  return {
    storeName: storeName,
    dbMode: type,
    error: (e: Event) => {
      reject(e);
    },
    complete: (e: Event) => {
      resolve();
    },
    abort: (e: Event) => {
      reject(e);
    }
  };
}

// export function* processRequest({ request, success, error }: any) {
//   request.onerror = function(event: Event) {
//     error(error);
//     yield error;
//   };
//   request.onsuccess = function(evt: Event) {
//     let cursor: IDBCursorWithValue = (<IDBRequest>evt.target).result;
//     if (cursor) {
//       result.push(cursor.value);
//       cursor.continue();
//     } else {
//       resolve(result);
//     }
//   };
// }
