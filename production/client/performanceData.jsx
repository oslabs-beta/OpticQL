import React, { useState, useContext } from "react";
import { Context } from "./store.jsx";
import ExpandPerfData from "./expandPerfData.jsx"

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

const PerfData = () => {

	const { store } = useContext(Context);
	const [showWindowPortal, setWindowPortal] = useState(false);
	// const [outerPerformanceObj, setPerformanceObj] = useState({});

	function toggleWindowPortal () {
		setWindowPortal(!showWindowPortal)
	}

	// Declaring variables to re-assign if store.query.extensions is not falsy
	const data = [];
	const htmlContainer = [];
	const chartContainer = [];
	let overallResTime;
	let startTime;
	let endTime;
	const performanceObj = {}

	function numberWithCommas (x) {
		return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
	}

	if (store.query.extensions) {
		// Declaring variables
		// const performanceObj = {};
		const topLevelQueryArr = [];
		const perfAvg = {};
		const anomaliesObj = {};

		// Saving top-level query information --> formatting overall response time (in ms) to include commas before the decimal
		overallResTime = numberWithCommas(
			(store.query.extensions.tracing.duration / 1000000).toFixed(4)
		);

		// Saving the rest of the top-level query information
		startTime = store.query.extensions.tracing.startTime;
		endTime = store.query.extensions.tracing.endTime;

		// Saving resolver-level information to a variable
		const performanceDataArray =
			store.query.extensions.tracing.execution.resolvers;

		// Resolver-level query information
		for (let i = 0; i < performanceDataArray.length; i++) {
			const currResolver = performanceDataArray[i];

			if (currResolver.path.length === 1) {
				const pathStr = currResolver.path[0];
				const pathDuration = currResolver.duration;
				topLevelQueryArr.push([pathStr, pathDuration]);
			} else {
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

		for (let perfQuery in performanceObj) {
			let perfArr = performanceObj[perfQuery];
			let average = 0;
			for (let i = 0; i < perfArr.length; i++) {
				average += perfArr[i][1];
			}
			const finalAvg = average / perfArr.length / 1000000;
			perfAvg[perfQuery] = Number(finalAvg.toFixed(4));
		}

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

		console.log("performanceObj ", performanceObj);
		console.log("topLevelQueryArr ", topLevelQueryArr);
		console.log("perfAvg:", perfAvg);
		console.log("anomaliesObj:", anomaliesObj);
		console.log("data: ", data);

		// Container for line chart --> Used when there is MORE THAN ONE path
		const containerLine = [
			<VictoryChart
				// theme={VictoryTheme.material}
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
						`Avg. response time: ${datum.t} ms,
            # total resolvers: ${datum.q},
            # outlier resolvers: ${datum.z}`
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

		// Adding <p> tags with top-level query information to container array (for rendering)
		htmlContainer.push(
			<p key={"overallPerfMetric: 0"} className="perfMetricPTag" className="perfMetricPTagTitle">Summary Performance Metrics:</p>
		);
		// container.push(
		// 	<p key={"overallPerfMetric: 1"} className="perfMetricPTag"> ▫ Overall query start time: {startTime}</p>
		// );
		// container.push(
		// 	<p key={"overallPerfMetric: 2"} className="perfMetricPTag"> ▫ Overall query end time: {endTime}</p>
		// );
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

		// Conditional statement to assign container to either the line or bar chart
		if (data.length === 1) {
			chartContainer.push(containerBar);
		} else {
			chartContainer.push(containerLine);
		}

		// setPerformanceObj(performanceObj)
	}

  // {store.loading && <img src="./assets/loading.gif" />}
  // {(!store.query.data && !store.loading) && <div id='queryPlaceholder'>No query results to display</div>}
  // {(store.query.data && !store.loading) && <div>{container}</div>}



	return (
  <div>
    {store.loading && <img src="./assets/loading.gif" />}
    {(!store.query.data && !store.loading) && <div id='queryPlaceholder'>No query results to display</div>}
    {(store.query.data && !store.loading) && 
    <div>
      <div className="performanceMetricsButtonInfo">
        <button onClick={toggleWindowPortal}
          className="performanceMetricsButton"
        >
          {/* {showWindowPortal ? 'Close the' : 'Open a'}  */}Expand Performance Metrics
        </button>
        <ExpandPerfData key={1} showWindow={showWindowPortal} container={htmlContainer} performance={performanceObj} />
        {/* {showWindowPortal && (
          <TestWindow>
            <h1>Counter in a portal: {showWindowPortal}</h1>
            <p>Even though I render in a different window, I share state!</p>

          </TestWindow>)} */}

        <div>{htmlContainer}</div>
      </div>
      <div>{chartContainer}</div>
    </div>
  }
  </div>
  )
};

export default PerfData;
