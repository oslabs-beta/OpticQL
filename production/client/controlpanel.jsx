import React, { useState, useEffect, useContext } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Context } from './store.jsx';

// Further actions: (1) ensure mutations work

const ControlPanel = () => {

	const { dispatch } = useContext(Context);

	const queryDB = useIndexedDB('queryData');
	const schemaDB = useIndexedDB('schemaData');
	const [query, setQuery] = useState();
	const [savedQuery, saveQuery] = useState();
	const [savedSchema, saveSchema] = useState();

	// Make query to User App's server API, in turn, User's database

	function makeQuery () {
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
			.then(res => saveQuery(res))
			.catch(err => console.log("This is the error: ", err));
	}

	// Invokes when savedQuery state is update, sending query to indexeddb

	useEffect(() => {
		if (savedQuery) {
			queryDB.add({ name: savedQuery })
				.then(id => {
					console.log('Query DB ID Generated: ', id);
				})
				.catch(err => console.log("Error with query database insertion: ", err));

			dispatch({
				type: "updateQuery",
				payload: savedQuery
			});
		}
	}, [savedQuery])

	// Requests all information from indexeddb table of queries

	function queryDatabaseGrab () {
		queryDB.getAll()
			.then(result => console.log(result))
			.catch(err => console.log("Error with getting all records from query database: ", err));
	};

	// Make query to User App's server API for updated GraphQL schema

	function requestSchema () {
		fetch('http://localhost:3000/getSchema')
			.then(res => res.json())
			.then(res => saveSchema(res))
			.catch(err => console.log('Error with fetching updated schema from User app: ', err));
	}
	// Invokes when savedSchema state is update, sending schema to indexeddb table of schema

	useEffect(() => {
		if (savedSchema) {
			schemaDB.add({ name: savedSchema })
				.then(id => {
					console.log('Schema ID Generated: ', id);
				})
				.catch(err => console.log("Error with schema database insertion: ", err))
				dispatch({
					type: "updateSchema",
					payload: savedSchema
				});
    }
	}, [savedSchema])

	// Requests all information from indexeddb for schemas

	function schemaDatabaseGrab () {
		schemaDB.getAll()
			.then(res => console.log(res))
			.catch(err => console.log("Error with getting all records from schema database: ", err));
	};

	// Used to capture updated information from form input field for queries

	function handleChange (e) {
		setQuery(e.target.value);
	}

	//grabs the input value (query) from the text box and invokes makeQuery function to send that query to Apollo server

	function handleSubmit (e) {
		e.preventDefault();
		makeQuery();
	}

	return (
		<div>
			<p>User Control Panel</p>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="query"></label>
					<textarea className="form-control" id="query" value={query} onChange={handleChange} placeholder="Please enter query here"></textarea>
				</div>
				<input type="submit" value="Submit Query" />
			</form>
			{/* <button key={1} onClick={queryDatabaseGrab}>Check Database for Queries</button> */}
			<button key={2} onClick={requestSchema}>Update Schema</button>
			{/* <button key={3} onClick={schemaDatabaseGrab}>Check Database for Schema</button> */}
		</div>
	)

}

export default ControlPanel;