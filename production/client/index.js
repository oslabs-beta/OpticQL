import React from 'react';
import { render } from 'react-dom';
import App from './App';
import { DBConfig } from './DBConfig';
import { initDB } from 'react-indexed-db';

initDB(DBConfig);

// https://www.npmjs.com/package/react-indexed-db

render(
	<App />,
	document.getElementById('root'),
);