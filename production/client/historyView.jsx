import React, { useContext, useEffect } from "react";
import NavBar from './navBar.jsx'
import { useIndexedDB } from 'react-indexed-db';
import { Context } from './store.jsx';

import {
	VictoryChart,
	VictoryTheme,
	VictoryZoomContainer,
	VictoryLine,
	VictoryAxis,
	VictoryBar,
	VictoryTooltip,
	VictoryVoronoiContainer,
} from "victory";

// Delete records from the database
// Render all historical info from the database
// Delete everything from database
// Chart rerenders when a past query is deleted? state -> boolean if deleted
// Victory line chart & tooltip (include the string on the x axis)

const History = () => {

	const { store } = useContext(Context);
	const queryDB = useIndexedDB('queryData');
	const data = [];
	const chartContainer = [];

	// To format response time with commas
	function numberWithCommas (x) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	// useEffect(() => {

	console.log("THE STORE QUERY, ", store.query);
	console.log("THE STORE, ", store);

	queryDB.getAll()
		.then(result => {
			console.log(result);
			return result;
		})
		// loop through the result and make an array with [query name, total duration]
		.then((result) => {
			for (let i = 0; i < result.length; i++) {
				const currQueryObj = result[i]
				data.push({
					x: currQueryObj.id,
					y: (currQueryObj.response.extensions.tracing.duration / 1000000),
					z: currQueryObj.queryString,
					t: numberWithCommas((currQueryObj.response.extensions.tracing.duration / 1000000).toFixed(4))
				})
			}
			console.log("data query :", data)
			return result;
		})
		.then((result) => {

			const containerLine = [
				<VictoryChart
					// theme={VictoryTheme.material}
					domainPadding={{ x: 10 }}
					containerComponent={
						<VictoryVoronoiContainer
							voronoiDimension="x"
							labels={({ datum }) =>
								`Query: ${datum.t} ms,
								Query String: ${datum.z}`
							}
							labelComponent={
								<VictoryTooltip
									// flyoutHeight={30}
									cornerRadius={5}
									flyoutStyle={{ fill: "#D4F1F4" }}
									style={{ fontSize: 9 }}
								/>
							}
						/>
					}
				>
					<VictoryLine
						style={{
							// labels: { fontSize: 6 },
							data: { stroke: "#189AB4" },
							// parent: { border: "1px solid #ccc" },
						}}
						data={data}
					// labels={({ datum }) => `Avg.: ${datum.y}`}
					/>
					<VictoryAxis
						style={{
							tickLabels: { fontSize: 10, padding: 15, angle: -30, fill: "white" },
							axis: { stroke: "white" },
						}}
					/>
					<VictoryAxis
						style={{
							tickLabels: { fontSize: 10, padding: 5, fill: "white" },
							axis: { stroke: "white" },
						}}
						dependentAxis
					/>
				</VictoryChart>,
			];

			// Container for bar chart --> Used when there is ONLY ONE path
			const containerBar = [
				<VictoryChart
					// theme={VictoryTheme.material}
					domainPadding={{ x: 5 }}
				// containerComponent={<VictoryZoomContainer />}
				>
					<VictoryBar
						style={{
							data: { fill: "#189AB4" },
						}}
						data={data}
						labels={({ datum }) =>
							`Query: ${datum.t} ms,
							Query String: ${datum.z}`
						}
						barWidth={({ index }) => index * 5 + 20}
						labelComponent={
							<VictoryTooltip
								dy={0}
								// centerOffset={{ x: 25 }}
								style={{ fontSize: 8 }}
								constrainToVisibleArea
							/>
						}
					/>
					<VictoryAxis
						style={{
							tickLabels: { fontSize: 10, padding: 5, fill: "white" },
							axis: { stroke: "white" },
						}}
					/>
					<VictoryAxis
						style={{
							tickLabels: { fontSize: 10, padding: 5, fill: "white" },
							axis: { stroke: "white" },
						}}
						dependentAxis
					/>
				</VictoryChart>,
			];


			console.log('I am now in the next .then');

			if (data.length === 1) {
				chartContainer.push(containerBar);
			} else {
				chartContainer.push(containerLine);
			}

			console.log('This is the updated chartContainer ', chartContainer);

		})
		.catch((err) => console.log("Error with getting all records from query database: ", err));

	// }, [])

	// Deletes all query in the database

	const handleDeleteQueryData = () => {
		queryDB.clear().then(() => {
			alert('Query database fully deleted!');
		});
	}

	// Victory charting of database information


	// const containerLine = [
	// 	<VictoryChart
	// 		// theme={VictoryTheme.material}
	// 		domainPadding={{ x: 10 }}
	// 		containerComponent={
	// 			<VictoryVoronoiContainer
	// 				voronoiDimension="x"
	// 				labels={({ datum }) =>
	// 					`Query: ${datum.t} ms,
	// 					Query String: ${datum.z}`
	// 				}
	// 				labelComponent={
	// 					<VictoryTooltip
	// 						// flyoutHeight={30}
	// 						cornerRadius={5}
	// 						flyoutStyle={{ fill: "#D4F1F4" }}
	// 						style={{ fontSize: 9 }}
	// 					/>
	// 				}
	// 			/>
	// 		}
	// 	>
	// 		<VictoryLine
	// 			style={{
	// 				// labels: { fontSize: 6 },
	// 				data: { stroke: "#189AB4" },
	// 				// parent: { border: "1px solid #ccc" },
	// 			}}
	// 			data={dummyData}
	// 		// labels={({ datum }) => `Avg.: ${datum.y}`}
	// 		/>
	// 		<VictoryAxis
	// 			style={{
	// 				tickLabels: { fontSize: 10, padding: 15, angle: -30, fill: "white" },
	// 				axis: { stroke: "white" },
	// 			}}
	// 		/>
	// 		<VictoryAxis
	// 			style={{
	// 				tickLabels: { fontSize: 10, padding: 5, fill: "white" },
	// 				axis: { stroke: "white" },
	// 			}}
	// 			dependentAxis
	// 		/>
	// 	</VictoryChart>,
	// ];

	// // Container for bar chart --> Used when there is ONLY ONE path
	// const containerBar = [
	// 	<VictoryChart
	// 		// theme={VictoryTheme.material}
	// 		domainPadding={{ x: 5 }}
	// 	// containerComponent={<VictoryZoomContainer />}
	// 	>
	// 		<VictoryBar
	// 			style={{
	// 				data: { fill: "#189AB4" },
	// 			}}
	// 			data={dummyData}
	// 			labels={({ datum }) =>
	// 				`Query: ${datum.t} ms,
	// 				Query String: ${datum.z}`
	// 			}
	// 			barWidth={({ index }) => index * 5 + 20}
	// 			labelComponent={
	// 				<VictoryTooltip
	// 					dy={0}
	// 					// centerOffset={{ x: 25 }}
	// 					style={{ fontSize: 8 }}
	// 					constrainToVisibleArea
	// 				/>
	// 			}
	// 		/>
	// 		<VictoryAxis
	// 			style={{
	// 				tickLabels: { fontSize: 10, padding: 5, fill: "white" },
	// 				axis: { stroke: "white" },
	// 			}}
	// 		/>
	// 		<VictoryAxis
	// 			style={{
	// 				tickLabels: { fontSize: 10, padding: 5, fill: "white" },
	// 				axis: { stroke: "white" },
	// 			}}
	// 			dependentAxis
	// 		/>
	// 	</VictoryChart>,
	// ];

	// if (data.length === 1) {
	// 	console.log("I am in chartcontainter push containerBar")
	// 	chartContainer.push(containerBar);
	// 	console.log("chartcontainer is:", chartContainer)
	// } else {
	// 	console.log("I am in chartcontainter push containerLine")
	// 	chartContainer.push(containerLine);
	// 	console.log("containerLine is", chartContainer)
	// 	console.log("data inside containerLine", data)
	// }

	return (
		<div>
			{chartContainer}
		</div>
	)
}

export default History;