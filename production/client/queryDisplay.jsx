import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';

const QueryDisplay = () => {

	const { store } = useContext(Context);
	const [response, setResponse] = useState(true);
	const [metrics, setMetrics] = useState(false);
	const [errors, setErrors] = useState(false);
	
	function handleGetMetrics (e) {
		e.preventDefault();
		setMetrics(!metrics)
		setResponse(false);
		setErrors(false);
	}

	function handleGetErrors (e) {
		e.preventDefault();
		setErrors(!errors);
		setResponse(false);
		setMetrics(false);
	}

	function handleGetResponse(e){
		e.preventDefault();
		setResponse(!response);
		setMetrics(false);
		setErrors(false);
	}

	return (
		<div>
			<div>
				<button onClick={handleGetResponse}>Response</button>
				<button onClick={handleGetMetrics}>Metrics</button>
				<button onClick={handleGetErrors}>Errors</button>
			</div>
			<div>
				{response && <pre><code>{JSON.stringify(store.query.data, null, 2)}</code></pre>}
				{metrics && <pre><code>{JSON.stringify(store.query.extensions, null, 2)}</code></pre>}
				{errors && <pre><code>{JSON.stringify(store.query.errors, null, 2)}</code></pre>}
			</div>
		</div>
	)
}

export default QueryDisplay;