import React, { useState, useEffect, useContext } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Context } from './store.jsx';
import CodeMirror from 'react-codemirror';
require('codemirror/lib/codemirror.css');

// Further actions: (1) ensure mutations work

const ControlPanel = () => {

	const { dispatch, store } = useContext(Context);

	const queryDB = useIndexedDB('queryData');
	const schemaDB = useIndexedDB('schemaData');
	const [query, setQuery] = useState();
	const [savedQuery, saveQuery] = useState();

	function numberWithCommas (x) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	// Make query to User App's server API, in turn, User's database

	function makeQuery () {
		// UPDATE A TRIGGER IN STORE THAT SAYS LOADING QUERY: TRUE
		dispatch({
			type: "updateLoading",
			payload: true
		});

		// ADD DISPATCH, send query to 'Mutation' variable
		// if query.includes('mutation')
		if (query.includes('mutation')) {
			dispatch({
				type: "mutation",
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
				console.log("This is the error: ", err);
			})
	}

	// Invokes when savedQuery state is update, sending query to indexeddb

	useEffect(() => {
		if (savedQuery && savedQuery.extensions) {
			// console.log('The saved query!: ', query)
			queryDB.add({
				queryString: query,
				response: savedQuery
			})
				.then(id => {
					console.log('Query DB ID Generated: ', id);
				})
				.catch(err => console.log("Error with query database insertion: ", err));

			dispatch({
				type: "updateQuery",
				payload: savedQuery
			});

			queryDB.getAll()
				.then(result => {
					console.log(result);
					return result;
				})
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

	// Requests all information from indexeddb table of queries

	function queryDatabaseGrab () {
		queryDB.getAll()
			.then(result => {
				console.log(result)
				console.log('The query living in state: ', store.query)
			})
			.catch(err => console.log("Error with getting all records from query database: ", err));
	};



	// Requests all information from indexeddb for schemas

	function schemaDatabaseGrab () {
		schemaDB.getAll()
			.then(res => console.log(res))
			.catch(err => console.log("Error with getting all records from schema database: ", err));
	};

	// Used to capture updated information from form input field for queries

	function handleChange (query_str) {
		// console.log('this is the event: ', e)
		setQuery(query_str);
	}

	//grabs the input value (query) from the text box and invokes makeQuery function to send that query to Apollo server

	function handleSubmit (e) {
		e.preventDefault();
		makeQuery();
	}

	//delete the queryData indexDB table

	const handleDeleteQueryData = () => {
		queryDB.clear().then(() => {
			alert('Query database fully deleted!');
		});
	}

	const handleDeleteSchemaData = () => {
		schemaDB.clear().then(() => {
			alert('Schema database fully deleted!');
		});
	}

	const options = {
		lineNumbers: true,
	}

	// Deprecated form to handle query text input
	// <form onSubmit={handleSubmit}>
	// 	<div id="form-group">
	// 		<div className="topLeftButtons" id="controlQuadrant">
	// 			<input type="submit" className="quadrantButton" id="submitQuery" value="Submit Query" />
	// 		</div>
	// 		{/* <label htmlFor="query"></label> */}
	// 		<textarea className="form-control" id="query" value={query} onChange={handleChange} placeholder="Please enter query here"></textarea>
	// 	</div>
	// </form>

	return (
		<div>
			<div className="topLeftButtons">
				<button className="quadrantButton" onClick={handleSubmit}>Submit Query</button>
				<CodeMirror options={options} id="query" value={query} onChange={handleChange} defaultValue="Please enter query here" />
			</div>
			<div className="indexDBbuttons">
				<button className="indexDBstyleButton" key={1} onClick={queryDatabaseGrab}>Check Database for Queries</button>
				<button className="indexDBstyleButton" key={2} onClick={schemaDatabaseGrab}>Check Database for Schema</button>
				<button className="indexDBstyleButton" key={3} onClick={handleDeleteQueryData}>Delete Query Data</button>
				<button className="indexDBstyleButton" key={4} onClick={handleDeleteSchemaData}>Delete Schema Data</button>
			</div>
		</div>
	)

}

export default ControlPanel;