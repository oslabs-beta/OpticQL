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

	function handleGetResponse(e){
    e.preventDefault();
    // e.target.style.backgroundColor='#D4F1F4'
    if (!response) {
      setResponse(true);
      setMetrics(false);
      setErrors(false);
    }
	}

	return (
		<div>
			<div className="topLeftButtons">
				<button style={{backgroundColor:response? '#D4F1F4' : '#75E6DA'}} className="quadrantButton" onClick={handleGetResponse}>Response</button>
				<button style={{backgroundColor:metrics? '#D4F1F4' : '#75E6DA'}}className="quadrantButton" onClick={handleGetMetrics}>Metrics</button>
				<button style={{backgroundColor:errors? '#D4F1F4' : '#75E6DA'}}className="quadrantButton" onClick={handleGetErrors}>Errors</button>
			</div>
      {!store.query.data && 
        <div id='queryPlaceholder'>No query results to display</div>
      }
      {store.query.data && 
        <div id='queryScroll'>
            {response && <pre><code>{JSON.stringify(store.query.data, null, 2)}</code></pre>}
            {metrics && <pre><code>{JSON.stringify(store.query.extensions, null, 2)}</code></pre>}
            {errors && <pre><code>{JSON.stringify(store.query.errors, null, 2)}</code></pre>}
        </div>
      }
		</div>
	)
}

export default QueryDisplay;