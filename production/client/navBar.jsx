import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useIndexedDB } from 'react-indexed-db';
import { Context } from './store.jsx';

const NavBar = () => {
	const queryDB = useIndexedDB('queryData');
	const schemaDB = useIndexedDB('schemaData');
	const { dispatch } = useContext(Context);

	const linkStyle = {
		"color": "#05445E",
		"textDecoration": "none",
	}

	function queryDatabaseGrab () {
		queryDB.getAll()
			.then(result => {
				console.log(result)
			})
			.catch(err => console.log("Error with getting all records from query database: ", err));
	};

	function schemaDatabaseGrab () {
		schemaDB.getAll()
			.then(res => console.log(res))
			.catch(err => console.log("Error with getting all records from schema database: ", err));
	};

	const handleDeleteQueryData = () => {
		queryDB.clear()
			.then(() => {
				alert('Query database fully deleted!');
				dispatch({
					type: "saveHistory",
					payload: [],
				});
			});
	}

	const handleDeleteSchemaData = () => {
		schemaDB.clear().then(() => {
			alert('Schema database fully deleted!');
		});
	}

	return (
		<div className="buttonNavBar">

			<div>
				<button className="indexDBstyleButton" key={1} onClick={queryDatabaseGrab}>Check Query Database Records</button>
				<button className="indexDBstyleButton" key={2} onClick={schemaDatabaseGrab}>Check Schema Database Records</button>
				<button className="indexDBstyleButton" key={3} onClick={handleDeleteQueryData}>Clear Query Database</button>
				<button className="indexDBstyleButton" key={4} onClick={handleDeleteSchemaData}>Clear Schema Database</button>
			</div>

		</div >
	);
}

export default NavBar;
