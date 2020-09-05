import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';

const QueryDisplay = () => {

	const { store } = useContext(Context);
	const result = Object.entries(store.query).map(([key, val]) =>
		<p key={key}> {key}: {val}</p>
	)
	console.log(result);

	return (
		<div>
			<p>hi</p>
		</div>
	)
}

export default QueryDisplay;