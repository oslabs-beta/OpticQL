import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { DBConfig } from './DBConfig';
import { initDB } from 'react-indexed-db';
import { BrowserRouter } from 'react-router-dom';

initDB(DBConfig);

// https://www.npmjs.com/package/react-indexed-db

// should grab the App component and attach to the index.html
render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root'),
);