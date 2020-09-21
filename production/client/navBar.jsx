import React, { useContext, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Context } from './store.jsx';

const NavBar = () => {
	const queryDB = useIndexedDB('queryData');
	const { dispatch, store } = useContext(Context);
	const [databaseID, setDatabaseID] = useState('');

	// Query IndexedDB for all request performance/response information 
	function queryDatabasePull () {
		queryDB.getAll()
			.then(res => {
				console.log('Query database information: ', res);
			})
			.catch(err => console.log("Error with getting all records from database: ", err));
	};

	// Clear all queries in IndexedDB
	const queryDatabaseClearAll = () => {
		queryDB.clear()
			.then(() => {
				alert('Query database fully deleted');
				dispatch({
					type: "saveHistory",
					payload: [],
				});
			});
	}

	// Step 1:Should a User select the option to delete a specific IndexedDB record
	function queryDatabaseCheckRecord () {
		if (Number(databaseID) >= 0) {
			queryDB.getAll()
				.then(res => {
					let doesExist = false;
					for (let i = 0; i < res.length; i += 1) {
						const currentRecord = res[i];
						if (currentRecord.id === Number(databaseID)) {
							doesExist = true;
							break;
						}
					}
					// Invoke queryDatabaseDeleteOne in the event the ID inputted into the form field matches an existing record in IndexedDB
					if (doesExist) {
						queryDatabaseDeleteOne();
					} else {
						alert('Specific record does not exist');
					}
				})
				.catch(err => console.log("Error with checking if specific record from database exists: ", err));
		} else {
			alert('Database ID must be a number greater than zero');
		}
	};

	// Step 2: In the event the specific record exists, deletes the specific record from IndexedDB
	function queryDatabaseDeleteOne () {
		queryDB.deleteRecord(Number(databaseID))
			.then(() => console.log('Record successfully deleted'))
			.catch(err => console.log("Error with getting deleting specific record from database: ", err));

		// Filter the current store.history variable to reflect the deletion of the specific record, so
		// the full page historical performance view is updated (HistoryView)
		const filtered = store.history.filter(obj => {
			return obj.x !== databaseID
		})

		// Updating store.history for the filtered array (which excludes the deleted record)
		dispatch({
			type: "saveHistory",
			payload: filtered
		})

	};
	// Grabbing the input database ID and updating local state
	const handleChange = (e) => {
		setDatabaseID(e.target.value);
	}

	return (
		<div className="buttonNavBar">
			<div>
				<button className="indexDBstyleButton" key={'navBar button: 1'} onClick={queryDatabasePull}>Pull Database</button>
				<button className="indexDBstyleButton" key={'navBar button: 2'} onClick={queryDatabaseClearAll}>Clear All Database</button>
				<button className="indexDBstyleButton" key={'navBar button: 3'} onClick={queryDatabaseCheckRecord}>Clear Specific Record</button>
				<input className="databaseIDButton" type="text" onChange={handleChange} placeholder="Database ID to Delete" />
			</div>
		</div >
	);
}

export default NavBar;
