import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { DBConfig } from './DBConfig';
import { initDB } from 'react-indexed-db';
import { HashRouter } from 'react-router-dom';

//Initializes indexedDB stores.
//Wraps app in react HashRouter (to preserve access to filepaths and static files).

initDB(DBConfig);

render(
	<HashRouter>
		<App />
	</HashRouter>,
	document.getElementById('root'),
);