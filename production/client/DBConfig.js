export const DBConfig = {
  name: 'OpticQL',
  version: 1,
  objectStoresMeta: [
    {
      store: 'schema',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'schemaInfo', keypath: 'schemaInfo', options: { unique: false } }
      ]
		},
		{
      store: 'queryData',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
				{ name: 'queryID', keypath: 'queryID', options: { unique: true } },
        { name: 'queryMetrics', keypath: 'queryMetrics', options: { unique: false } }
      ]
    }
  ]
};