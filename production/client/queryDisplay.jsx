import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';

const QueryDisplay = () => {

	const { store } = useContext(Context);

	// Handles error messages from queries
	// const errorArr = [];
	// if (store.query.errors) {
	// 	store.query.errors.forEach((errObj, i) => {
	// 		errorArr.push(<ErrorHandler key={i} message={errObj.message} />)
	// 	})
	// }

	// const QueryRenderer = (props) => {
	// 	return (
	// 		<div>
	// 			<p>{props.val}</p>
	// 		</div>
	// 	)
	// }

	// const FieldResult = (props) => {
	// 	return (
	// 		<div>
	// 			<p>{props.val}</p>
	// 		</div>
	// 	)
	// }

	// const OpeningCurly = () => {
	// 	const str = '{'
	// 	return (
	// 		<p>{str}</p>
	// 	)
	// }

	// const ClosingCurly = () => {
	// 	const str = '},'
	// 	return (
	// 		<p>{str}</p>
	// 	)
	// }

	// // Handles data to display
	// const dataArr = [];

	// // Checking if results are valid
	// if (store.query.data) {

	// 	// Accessing each sibling query
	// 	const siblingContainer = [];

	// 	for (let siblingKey in store.query.data) {

	// 		const masterObj = store.query.data;

	// 		// Opens up each sibling query
	// 		const openingArray = `"${siblingKey}": [`
	// 		const finalOpeningArray = <QueryRenderer key={`Open Sibling Query: ${siblingKey}`} val={openingArray} />
	// 		siblingContainer.push(finalOpeningArray);

	// 		// For loop through each sibling result query
	// 		for (let i = 0; i < masterObj[siblingKey].length; i++) {

	// 			// Each individual result from query
	// 			const fieldObj = masterObj[siblingKey][i]

	// 			const fieldContainer = [];
	// 			fieldContainer.push(<OpeningCurly key={`openingCurly:', ${i}`} />)

	// 			for (const fieldName in fieldObj) {
	// 				if (typeof fieldObj[fieldName] !== 'object') {
	// 					const field = `"${fieldName}": ${fieldObj[fieldName]}`
	// 					fieldContainer.push(<FieldResult key={`field: ${i}`} val={field} />)
	// 				}
	// 			}

	// 			fieldContainer.push(<ClosingCurly key={`closingCurly:', ${i}`} />)
	// 			siblingContainer.push(fieldContainer)

	// 		}

	// 		// Closes out each sibling query
	// 		const closingArray = `],`
	// 		const finalClosingArray = <QueryRenderer key={`Close Sibling Query: ${siblingKey}`} val={closingArray} />
	// 		siblingContainer.push(finalClosingArray)
	// 	}

	// 	dataArr.push(siblingContainer);
	// 	console.log("dataArr:", dataArr)

	// }

	return (
		<div>
			<p>Query Response:</p>
			<pre><code>{JSON.stringify(store.query.data, null, 2)}</code></pre>
			<p>Query Metrics:</p>
			<pre><code>{JSON.stringify(store.query.extensions, null, 2)}</code></pre>
			<p>Summary of Errors:</p>
			<pre><code>{JSON.stringify(store.query.errors, null, 2)}</code></pre>
		</div>
	)
}

export default QueryDisplay;