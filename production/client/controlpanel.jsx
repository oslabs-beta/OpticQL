import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Context } from './store.jsx';
import CodeMirror from 'react-codemirror';
import throttle from 'lodash/throttle';

require('codemirror/lib/codemirror.css');
const placeholder = require('codemirror/addon/display/placeholder');

const ControlPanel = () => {

	const { dispatch, store } = useContext(Context);

	const queryDB = useIndexedDB('queryData');
	const [query, setQuery] = useState();
	const [savedQuery, saveQuery] = useState();

	function numberWithCommas (x) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	// Make query to User App's server API, in turn, User's database

	function makeQuery () {
		// Update a trigger in store that says loading query: true
		dispatch({
			type: "updateLoading",
			payload: true
		});

		// Add Dispath --- send query to 'Mutation' variable
		// if query.includes('mutation')
		if (query.includes('mutation')) {
			dispatch({
				type: "mutation",
				payload: query
			});

			dispatch({
				type: "mutationEvent",
				payload: query
			});

		};

		fetch('http://localhost:3000/graphql', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				query: query,
			})
		})
			.then(res => res.json())
			.then((res) => {
				console.log("Fetch response: ", res)
				saveQuery(res)
				dispatch({
					type: "updateLoading",
					payload: false
				});
			})
			.catch(err => {
				dispatch({
					type: "updateLoading",
					payload: false
				});
				console.log("Fetch error: ", err);
			})
	}

  // throttled version of makeQuery: 
  const makeQueryThrottled = useCallback(throttle(makeQuery, 1000), [query])

	// Invokes when savedQuery state is update, sending query to indexeddb

	useEffect(() => {
		if (savedQuery && savedQuery.extensions) {
			queryDB.add({
				queryString: query,
				response: savedQuery
			})
				.then(id => {
					console.log('Success! Query DB ID Generated: ', id);
				})
				.catch(err => console.log("Error with query database insertion: ", err));

			dispatch({
				type: "updateQuery",
				payload: savedQuery
			});

			queryDB.getAll()
				// Loop through the result and make an array with [query name, total duration]
				.then(result => {
					const dbData = [];
					for (let i = 0; i < result.length; i++) {
						const currQueryObj = result[i]
						dbData.push({
							x: (currQueryObj.id).toString(),
							y: (currQueryObj.response.extensions.tracing.duration / 1000000),
							z: currQueryObj.queryString,
							t: numberWithCommas((currQueryObj.response.extensions.tracing.duration / 1000000).toFixed(4))
						})
					}
					dispatch({
						type: "saveHistory",
						payload: dbData
					});
				})
				.catch(err => console.log("Error with database query for all historical information: ", err));

		}
	}, [savedQuery])

	// Used to capture updated information from form input field for queries
	function handleChange (query_str) {
		setQuery(query_str);
	}

	//grabs the input value (query) from the text box and invokes makeQuery function to send that query to Apollo server
	function handleSubmit (e) {
		e.preventDefault();
		if (query) {
			makeQueryThrottled();
		} else {
			alert('Please input a valid query/mutation request');
		}
	}

  

	const options = {
		lineNumbers: true,
		placeholder: "Enter query or mutation here:"
	}

	return (
		<div>
			<div className="topLeftButtons">
				<button className="quadrantButton" onClick={handleSubmit}>Submit Query</button>
				<CodeMirror options={options} id="query" value={query} onChange={handleChange} />
			</div>
		</div>
	)

}

export default ControlPanel;
