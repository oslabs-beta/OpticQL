import React, { useState, Component } from 'react';
import { useIndexedDB } from 'react-indexed-db';


const ControlPanel = () => {

	const db = useIndexedDB('queryData');
	const [query, setQuery] = useState();
	const [savedQuery, saveQuery] = useState();

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
			.then(res => {
				console.log("This is the response: ", res);
				saveQuery(res);
			})
			.catch(err => console.log("This is the error: ", err));
	}

	function databaseInsert () {

		db.add({ name: savedQuery })
			.then(id => {
				console.log('ID Generated: ', id);
			})
			.catch(err => console.log("Error with database insertion: ", err))
	};

	function databaseGrab () {
		db.getAll()
			.then(result => console.log(result))
			.catch(err => console.log("Error with getting all records from database: ", err));
	};

	function clickSchema () {
		fetch('http://localhost:3000/getSchema')
			.then((res) => {
				return res.json()
			})
			.then((data) => {
				console.log('Updated schema: ')
				console.log(data)
			})
	}

	function handleChange (e) {
		setQuery(e.target.value);
	}

	function handleSubmit (e) {
		e.preventDefault();
		console.log(query);
		makeQuery();
	}

	return (

		<div>
			<p>User Control Panel</p>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="query">Please enter query here</label>
					<textarea className="form-control" id="query" rows="3" value={query} onChange={handleChange}></textarea>
				</div>
				<input type="submit" value="Submit" />
			</form>
			<button onClick={databaseInsert}>Insert into Database</button>
			<button onClick={databaseGrab}>Check Database</button>
		</div>

	)

}

export default ControlPanel;