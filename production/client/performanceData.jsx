import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { Context } from "./store.jsx";
import ExpandPerfData from "./expandPerfData.jsx";
import {
	VictoryChart,
	VictoryLine,
	VictoryAxis,
	VictoryBar,
	VictoryTooltip,
	VictoryVoronoiContainer,
} from "victory";

const PerfData = () => {

	const { store } = useContext(Context);

	// Local state to show or hide the pop-up window
	const [showWindowPortal, setWindowPortal] = useState(false);

	// Change state of showWindowPortal whenever Expand Performance Metrics button is clicked
	function toggleWindowPortal () {
		setWindowPortal(!showWindowPortal)
	}

	// To format the response metrics with commas if 4 digits or more
	function numberWithCommas (x) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	// Declaring variables to re-assign if store.query.extensions is not falsy
	const data = [];
	// Variable for rendering of the Summary Performance Metrics text in the upper right hand corner of lower left quadrant
	const htmlContainer = [];
	// Variable for rending of the main charting (bar or line Victory charts)
	const chartContainer = [];
	let overallResTime;
	let startTime;
	let endTime;
	const performanceObj = {};
	const perfAvg = {};
	const anomaliesObj = {};

	// If the request is valid (with an associated response), and it is not a mutation request
	if (store.query.extensions && !store.mutationEvent) {
		const topLevelQueryArr = [];

		// Saving top-level request information --> formatting overall response time (in ms) to include commas before the decimal
		overallResTime = numberWithCommas(
			(store.query.extensions.tracing.duration / 1000000).toFixed(4)
		);

		// Saving the rest of the top-level (overall) request information
		startTime = store.query.extensions.tracing.startTime;
		endTime = store.query.extensions.tracing.endTime;

		// Saving resolver-level information to a variable
		const performanceDataArray = store.query.extensions.tracing.execution.resolvers;

		// Resolver-level query information
		for (let i = 0; i < performanceDataArray.length; i++) {
			const currResolver = performanceDataArray[i];

			// This captures 'parent' resolvers and associated duration
			if (currResolver.path.length === 1) {
				const pathStr = currResolver.path[0];
				const pathDuration = currResolver.duration;
				topLevelQueryArr.push([pathStr, pathDuration]);
			} else {
				// 'Children' resolvers and duration get stored in performanceObj
				const pathStrJoined = currResolver.path.join(".");
				const pathKey = currResolver.path.filter(function (curEl) {
					return typeof curEl === "string";
				});
				const pathKeyJoined = pathKey.join(".");
				if (performanceObj[pathKeyJoined]) {
					performanceObj[pathKeyJoined].push([pathStrJoined, currResolver.duration]);
				} else {
					performanceObj[pathKeyJoined] = [[pathStrJoined, currResolver.duration]];
				}
			}
		}

		// Finding the average of all the 'children' resolvers duration time for each identified path
		for (let perfQuery in performanceObj) {
			let perfArr = performanceObj[perfQuery];
			let average = 0;
			for (let i = 0; i < perfArr.length; i++) {
				average += perfArr[i][1];
			}
			const finalAvg = average / perfArr.length / 1000000;
			perfAvg[perfQuery] = Number(finalAvg.toFixed(4));
		}

		// Isolating the 'children' resolvers where the duration time exceeds the average duration time for that identified path
		for (const [pathName, avg] of Object.entries(perfAvg)) {
			const anomaliesArr = [];
			const arrayOfTimes = performanceObj[pathName];
			arrayOfTimes.forEach((el) => {
				const resTime = el[1] / 1000000;
				if (resTime > avg) {
					anomaliesArr.push(`${el[0]}: ${resTime} ms`);
				}
			});
			anomaliesObj[pathName] = anomaliesArr;
		}

		// Declaring the performance data to be rendered in Victory chart 
		for (let queryKey in perfAvg) {
			let queryKeyObj = {};
			queryKeyObj.x = queryKey;
			queryKeyObj.y = perfAvg[queryKey];
			queryKeyObj.z = anomaliesObj[queryKey].length;
			queryKeyObj.q = performanceObj[queryKey].length;
			queryKeyObj.t = numberWithCommas(perfAvg[queryKey].toFixed(4));
			data.push(queryKeyObj);
		}

		// Console logs for error-checking
		// console.log("performanceObj ", performanceObj);
		// console.log("topLevelQueryArr ", topLevelQueryArr);
		// console.log("perfAvg:", perfAvg);
		// console.log("anomaliesObj:", anomaliesObj);
		// console.log("data: ", data);

		// Container for line chart --> Used when there is MORE THAN ONE path
		const containerLine = [
			<VictoryChart
				height={350}
				padding={60}
				domainPadding={{ x: 10 }}
				containerComponent={
					<VictoryVoronoiContainer
						voronoiDimension="x"
						labels={({ datum }) =>
							`Avg. response time: ${datum.t} ms,
              # total resolvers: ${datum.q},
              # outlier resolvers: ${datum.z}`
						}
						labelComponent={
							<VictoryTooltip
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
						data: { stroke: "#189AB4" },
					}}
					// Performance data is inputted here
					data={data}
				/>
				<VictoryAxis
					label={"Path"}
					style={{
						tickLabels: { fontSize: 10, padding: 15, angle: -30, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white", padding: 45 },
					}}
				/>
				<VictoryAxis
					label={"Duration Time (ms)"}
					style={{
						tickLabels: { fontSize: 10, padding: 5, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white", padding: 40 },
					}}
					dependentAxis
				/>
			</VictoryChart>,
		];

		// Container for bar chart --> Used when there is ONLY ONE path
		const containerBar = [
			<VictoryChart
				height={350}
				padding={60}
				domainPadding={{ x: 5 }}
			>
				<VictoryBar
					style={{
						data: { fill: "#189AB4" },
					}}
					// Performance data is inputted here
					data={data}
					labels={({ datum }) =>
						`Avg. response time: ${datum.t} ms,
            # total resolvers: ${datum.q},
            # outlier resolvers: ${datum.z}`
					}
					barWidth={({ index }) => index * 5 + 20}
					labelComponent={
						<VictoryTooltip
							dy={0}
							style={{ fontSize: 8 }}
							constrainToVisibleArea
						/>
					}
				/>
				<VictoryAxis
					label={"Path"}
					style={{
						tickLabels: { fontSize: 10, padding: 5, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white" },
					}}
				/>
				<VictoryAxis
					label={"Duration Time (ms)"}
					style={{
						tickLabels: { fontSize: 10, padding: 5, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white", padding: 40 },
					}}
					dependentAxis
				/>
			</VictoryChart>,
		];

		// Adding <p> tags with top-level query information to HTMLcontainer array
		htmlContainer.push(
			<p key={"overallPerfMetric: 0"} className="perfMetricPTag" className="perfMetricPTagTitle">Summary Performance Metrics:</p>
		);

		htmlContainer.push(
			<p key={"overallPerfMetric: 3"} className="perfMetricPTag">
				▫ Overall response time: {overallResTime} ms
      </p>
		);

		for (let i = 0; i < topLevelQueryArr.length; i++) {
			let overallParentResTime = numberWithCommas(
				(topLevelQueryArr[i][1] / 1000000).toFixed(4)
			);

			htmlContainer.push(
				<p
					key={`Time Elapsed to parent resolver-${i}`}
					className="perfMetricPTag"
				>{` ▫ Response time to ${topLevelQueryArr[i][0]} field: ${overallParentResTime} ms`}</p>
			);
		}

		// Conditional statement to assign chartContainer to either the line or bar chart

		if (data.length === 1) {
			chartContainer.push(containerBar);
		} else {
			chartContainer.push(containerLine);
		}
	}

	// If the request is valid (with an associated response), and it is a MUTATION request
	if (store.query.extensions && store.mutationEvent) {

		// Saving the overall duration time for the MUTATION request
		const overallDurationTime = numberWithCommas(((store.query.extensions.tracing.duration) / 1000000).toFixed(4));

		// Saving the resolvers array to a variable
		const resolverArr = store.query.extensions.tracing.execution.resolvers;

		// For loop to create a data object to be rendered inside Victory charts
		for (let i = 0; i < resolverArr.length; i++) {
			// If conditional to isolate where the resolver path is only one field (which indicates a mutation request vs. the callback fields requested)
			if (resolverArr[i].path.length === 1) {
				const resolverDuration = (resolverArr[i].duration) / 1000000;
				const resolverName = resolverArr[i].path[0];
				const mutationObj = {};
				mutationObj.x = resolverName;
				mutationObj.y = resolverDuration;
				mutationObj.z = numberWithCommas(resolverDuration.toFixed(4));
				data.push(mutationObj);
			}
		}

		// Adding <p> tags with top-level query information to HTMLcontainer array
		htmlContainer.push(
			<p key={"overallPerfMetric: 0"} className="perfMetricPTag" className="perfMetricPTagTitle">Summary Performance Metrics:</p>
		);

		htmlContainer.push(
			<p key={"overallPerfMetric: 3"} className="perfMetricPTag">
				▫ Overall response time: {overallDurationTime} ms
      </p>
		);

		// Container for line chart --> Used when there is MORE THAN ONE path
		const containerLine = [
			<VictoryChart
				height={350}
				padding={60}
				domainPadding={{ x: 10 }}
				containerComponent={
					<VictoryVoronoiContainer
						voronoiDimension="x"
						labels={({ datum }) =>
							`Response time: ${datum.z} ms`
						}
						labelComponent={
							<VictoryTooltip
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
						data: { stroke: "#189AB4" },
					}}
					// Performance data is inserted here
					data={data}
				/>
				<VictoryAxis
					label={"Path"}
					style={{
						tickLabels: { fontSize: 10, padding: 15, angle: -30, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white", padding: 45 },
					}}
				/>
				<VictoryAxis
					label={"Duration Time (ms)"}
					style={{
						tickLabels: { fontSize: 10, padding: 5, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white", padding: 40 },
					}}
					dependentAxis
				/>
			</VictoryChart>,
		];

		// Container for bar chart --> Used when there is ONLY ONE path
		const containerBar = [
			<VictoryChart
				height={350}
				padding={60}
				domainPadding={{ x: 5 }}
			>
				<VictoryBar
					style={{
						data: { fill: "#189AB4" },
					}}
					// Performance data is inserted here
					data={data}
					labels={({ datum }) =>
						`Response time: ${datum.z} ms`
					}
					barWidth={({ index }) => index * 5 + 20}
					labelComponent={
						<VictoryTooltip
							dy={0}
							style={{ fontSize: 8 }}
							constrainToVisibleArea
						/>
					}
				/>
				<VictoryAxis
					label={"Path"}
					style={{
						tickLabels: { fontSize: 10, padding: 5, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white" },
					}}
				/>
				<VictoryAxis
					label={"Duration Time (ms)"}
					style={{
						tickLabels: { fontSize: 10, padding: 5, fill: "white" },
						axis: { stroke: "white" },
						axisLabel: { fontSize: 12, fill: "white", padding: 40 },
					}}
					dependentAxis
				/>
			</VictoryChart>,
		];

		// Conditional statement to assign chartContainer to either the line or bar chart
		if (data.length === 1) {
			chartContainer.push(containerBar);
		} else {
			chartContainer.push(containerLine);
		}
	}

	const linkStyle = {
		"color": "#05445E",
		"textDecoration": "none",
	}

	return (
		<div>
			{store.loading && <div className="loadingBox"><img className='loadingImg' src="./assets/loading.gif" /></div>}
			{(!store.query.data && !store.loading) && <div id='queryPlaceholder'>No query results to display</div>}
			{(store.query.data && !store.loading) &&
				<div>
					<div className="performanceMetricsButtonInfo">
						<button onClick={toggleWindowPortal} className="performanceMetricsButton">
							Expand Performance Metrics
						</button>

						<button className="performanceMetricsButton">
							<Link to="/fullhistory" style={linkStyle}>View Historical Metrics</Link>
						</button>

						<ExpandPerfData key={'ExpandPerfData 1'} showWindow={showWindowPortal} performanceAvg={perfAvg} anomaliesObject={anomaliesObj} performance={performanceObj} />
						<div>{htmlContainer}</div>
					</div>
					<div className="chartContainerDiv">{chartContainer}</div>
				</div>
			}
		</div>
	)
};

export default PerfData;
