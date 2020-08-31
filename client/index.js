import React from 'react';
import { render } from 'react-dom';
import App from './App';

const electron = require('electron')

// should grab the App component and attach to the index.html
render(
    <App />,
    document.getElementById('root'),
);