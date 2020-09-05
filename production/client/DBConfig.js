export const DBConfig = {
	name: 'OpticQL',
	version: 2,
	objectStoresMeta: [
		{
			store: 'schemaData',
			storeConfig: { keyPath: 'id', autoIncrement: true },
			storeSchema: [
				{ name: 'schemaInfo', keypath: 'schemaID', options: { unique: true } },
				{ name: 'schemaMetrics', keypath: 'schemaMetrics', options: { unique: false } }
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


