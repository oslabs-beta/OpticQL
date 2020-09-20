export const DBConfig = {
	name: 'OpticQL',
	version: 3,
	objectStoresMeta: [
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


