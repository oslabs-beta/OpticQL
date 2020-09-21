import React, { useContext, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db';
import { Context } from './store.jsx';

const NavBar = () => {
	const queryDB = useIndexedDB('queryData');
	const { dispatch, store } = useContext(Context);
	const [databaseID, setDatabaseID] = useState('');

	function queryDatabasePull () {
		queryDB.getAll()
			.then(res => {
				console.log('Query database information: ', res);
			})
			.catch(err => console.log("Error with getting all records from database: ", err));
	};

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

	function queryDatabaseDeleteOne () {
		queryDB.deleteRecord(Number(databaseID))
			.then(() => console.log('Record successfully deleted'))
			.catch(err => console.log("Error with getting deleting specific record from database: ", err));
		
		// for loop through
		const filtered = store.history.filter(obj => {
			return obj.x !== databaseID
		})
		
		dispatch ({
			type: "saveHistory",
			payload: filtered
		})

	};

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
		</div>
	);
}

export default NavBar;
