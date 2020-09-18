import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';

const QueryDisplay = () => {

	const { store } = useContext(Context);
	const [response, setResponse] = useState(true);
	const [metrics, setMetrics] = useState(false);
	const [errors, setErrors] = useState(false);

	function handleGetMetrics (e) {
		e.preventDefault();
		if (!metrics) {
			setMetrics(true)
			setResponse(false);
			setErrors(false);
		}
	}

	function handleGetErrors (e) {
		e.preventDefault();
		if (!errors) {
			setErrors(true);
			setResponse(false);
			setMetrics(false);
		}
	}

	function handleGetResponse (e) {
		e.preventDefault();
		// e.target.style.backgroundColor='#D4F1F4'
		if (!response) {
			setResponse(true);
			setMetrics(false);
			setErrors(false);
		}
	}

	let responseButton = response ? 'queryDisplayTrue' : 'queryDisplayFalse'

	// <img src="./assets/logo2.png" />
	return (
		<div>
      {(!store.query.extensions && !store.loading) &&
        <div id='queryPlaceholder'>No query results to display</div>
      }
      {store.loading && 
          <img src="./assets/loading.gif" className="loading" />
      }
      {(store.query.extensions && !store.loading) &&
        <div>
          <div className="topLeftButtons">
            <button className={response ? 'queryDisplayTrue' : 'queryDisplayFalse'} onClick={handleGetResponse}>Response</button>
            <button className={metrics ? 'queryDisplayTrue' : 'queryDisplayFalse'}  onClick={handleGetMetrics}>Metrics</button>
            <button className={errors ? 'queryDisplayTrue' : 'queryDisplayFalse'}  onClick={handleGetErrors}>Errors</button>
          </div>
          <div id='queryScroll'>
              {response && <pre><code>{JSON.stringify(store.query.data, null, 2)}</code></pre>}
              {metrics && <pre><code>{JSON.stringify(store.query.extensions, null, 2)}</code></pre>}
              {errors && <pre><code>{JSON.stringify(store.query.errors, null, 2)}</code></pre>}
          </div>
        </div>
      }
		</div>
	)
}

export default QueryDisplay;