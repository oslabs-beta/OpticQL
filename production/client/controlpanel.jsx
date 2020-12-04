import React, { useState, useEffect, useContext, useCallback } from "react";
import { useIndexedDB } from "react-indexed-db";
import { Context } from "./store.jsx";
import CodeMirror from "react-codemirror";
import throttle from "lodash/throttle";

require("codemirror/lib/codemirror.css");
const placeholder = require("codemirror/addon/display/placeholder");

const ControlPanel = () => {
	const { dispatch } = useContext(Context);
	const queryDB = useIndexedDB("queryData");
	const [query, setQuery] = useState();
	const [savedQuery, saveQuery] = useState();

	// Function to cleanly format response time string with commas
	function numberWithCommas (x) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	// Make query to User's App's server API, in turn, User's database

	function makeQuery () {
		// Update a trigger in store that says loading query: true
		dispatch({
			type: "updateLoading",
			payload: true,
		});

		if (query.includes("mutation")) {
			// Add Dispatch --- send query to 'Mutation' variable in Store (for graphViz.jsx purposes)
			dispatch({
				type: "mutation",
				payload: query,
			});

			// Add Dispatch --- send query to 'Mutation' (for Performance Data purposes)
			dispatch({
				type: "mutationEvent",
				payload: query,
			});
		} else {
			dispatch({
				type: "mutationEvent",
				payload: false,
			});
		}
		// Execute fetch with query or mutation request to User app's server API
		fetch("http://localhost:3000/graphql", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query: query,
			}),
		})
			.then((res) => res.json())
			.then((res) => {
				console.log("Fetch response: ", res);
				// Updating state of savedQuery to incoming response
				saveQuery(res);
				// Loading.gif feature
				dispatch({
					type: "updateLoading",
					payload: false,
				});
			})
			.catch((err) => {
				// Loading.gif feature
				dispatch({
					type: "updateLoading",
					payload: false,
				});
				console.log("Fetch error: ", err);
			});
	}

	// throttled version of makeQuery:
	const makeQueryThrottled = useCallback(throttle(makeQuery, 1000), [query]);

	// Invokes when savedQuery state variable is updated, sending query to IndexedDB

	useEffect(() => {
		// Prevents the request from being saved in the database IF the query or mutation request is not valid
		if (savedQuery && savedQuery.extensions) {
			// Adding request string (query or mutation) & database response information to the database
			queryDB
				.add({
					queryString: query,
					response: savedQuery,
				})
				.then((id) => {
					console.log("Success! Query DB ID Generated: ", id);
				})
				.catch((err) =>
					console.log("Error with query database insertion: ", err)
				);

			// savedQuery being updated in global store
			dispatch({
				type: "updateQuery",
				payload: savedQuery,
			});

			// Querying database for all records to create an object to use for historyView.jsx Victory chart
			queryDB
				.getAll()
				.then((result) => {
					const dbData = [];
					for (let i = 0; i < result.length; i++) {
						const currQueryObj = result[i];
						dbData.push({
							x: currQueryObj.id.toString(),
							y: currQueryObj.response.extensions.tracing.duration / 1000000,
							z: currQueryObj.queryString,
							t: numberWithCommas(
								(
									currQueryObj.response.extensions.tracing.duration / 1000000
								).toFixed(4)
							),
						});
					}
					// Updating the store with the dbData object created
					dispatch({
						type: "saveHistory",
						payload: dbData,
					});
				})
				.catch((err) =>
					console.log(
						"Error with database query for all historical information: ",
						err
					)
				);
		}
		// Listening to changes for savedQuery
	}, [savedQuery]);

	// Used to capture updated information from form input field for requests (queries or mutations)
	function handleChange (query_str) {
		setQuery(query_str);
	}

	// Grabs the input value (query or mutation) from Codemirror, invoking makeQuery function to send that request to the User App's server API
	function handleSubmit (e) {
		e.preventDefault();
		if (query) {
			makeQueryThrottled();
		} else {
			alert("Please input a valid query/mutation request");
		}
	}

	const options = {
		lineNumbers: true,
		placeholder: "Enter query or mutation here:",
	};

	return (
		<div>
			<div id="submitQueryContainer" className="topLeftButtons">
				<button
					id="submitQuery"
					className="quadrantButton"
					onClick={handleSubmit}
				>
					Submit Query
        </button>
				<CodeMirror
					options={options}
					id="query"
					value={query}
					onChange={handleChange}
				/>
			</div>
		</div>
	);
};

export default ControlPanel;
