import React, { useState, useEffect, useContext, PropTypes } from 'react';
import { Context } from './store.jsx';


const PerformanceDisplay = () => {

	const { store } = useContext(Context);

	if (store.query.extensions) {

		const performanceDataArray = store.query.extensions.tracing.execution.resolvers

		const parentLevelData = {
			overallResponseTime: [0, store.query.extensions.tracing.duration],
		};

		const resolverLevelData = {};

		for (let i = 0; i < performanceDataArray.length - 1; i++) {
			const currResolver = performanceDataArray[i]
			//if it is a parent, store it in the parentLevelData object
			if (currResolver.path.length === 1) {
				const pathStr = currResolver.path[0]
				parentLevelData[pathStr] = [currResolver.startOffset, currResolver.duration]
			} else {
				//join the elements in the path array and store it in resolverLevelData object
				const pathStr = currResolver.path.join('.');
				resolverLevelData[pathStr] = [currResolver.startOffset, currResolver.duration]
			}
		}

		// console.log(resolverLevelData);

		const resolverContainer = [
			["Element", "Duration", { role: "style" }],
			// ["Overall Response", overallResponseTime, "silver"]
		];

		for (let queryStr in resolverLevelData) {
			let queryPerfArr = []
			queryPerfArr.push(queryStr, resolverLevelData[queryStr][1], "silver")
			resolverContainer.push(queryPerfArr)
		}

		const parentContainer = [
			["Element", "Duration", { role: "style" }],
		]

		for (let queryStr in parentLevelData) {
			let queryPerfArr = []
			queryPerfArr.push(queryStr, parentLevelData[queryStr][1], "silver")
			parentContainer.push(queryPerfArr)
		}

		// console.log("parentContainer:", parentContainer)
		// console.log("store.query.extensions.tracing.duration", store.query.extensions.tracing.duration)

		google.charts.load("current", { packages: ["corechart"] });
		google.charts.setOnLoadCallback(drawChart1);

		google.charts.load("current", { packages: ["corechart"] });
		google.charts.setOnLoadCallback(drawChart2);


		// console.log("This is the RESOLVER CONTAINER: ", resolverContainer);

		function drawChart1 () {

			const data = google.visualization.arrayToDataTable(parentContainer);

			const options = {
				title: "Top-level query response times (in milliseconds)",
				height: 400,
				width: "100%",
				bar: { groupWidth: "95%" },
				legend: { position: "none" },
				explorer: {},
				keepInBounds: true,
				fontSize: "8px",
			};

			const chart = new google.visualization.BarChart(document.getElementById('chart1'));

			chart.draw(data, options);
		}

		function drawChart2 () {

			const data = google.visualization.arrayToDataTable(resolverContainer);

			const options = {
				title: "Resolver-level response times (in milliseconds)",
				height: 4000,
				width: "100%",
				bar: { groupWidth: "95%" },
				legend: { position: "none" },
				explorer: {},
				keepInBounds: true,
				fontSize: "8px",
			};

			const chart = new google.visualization.BarChart(document.getElementById('chart2'));

			chart.draw(data, options);
		}

	}

	return (
		<div>
		</div>
	)
}

export default PerformanceDisplay;