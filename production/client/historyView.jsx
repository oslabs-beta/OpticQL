import React, { useContext } from "react";
import { Context } from './store.jsx';
import { Link } from 'react-router-dom';
import {
	VictoryChart,
	VictoryLine,
	VictoryAxis,
	VictoryBar,
	VictoryTooltip,
	VictoryVoronoiContainer,
} from "victory";

const History = () => {

	const { store } = useContext(Context);

	// Declaring an empty array to store either the line chart, bar chart, or string (for no historical data)
	let chartContainer = [];

	// Container for line chart --> Used when there is more than ONE path
	const containerLine = [
		<VictoryChart
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
							cornerRadius={5}
							flyoutStyle={{ fill: "#D4F1F4" }}
							style={{ fontSize: 6 }}
							constrainToVisibleArea
							flyoutPadding={5}
						/>
					}
				/>
			}
		>
			<VictoryLine
				style={{
					data: { stroke: "#189AB4" },
				}}
				// Performance data inserted here
				data={store.history}
			/>
			<VictoryAxis
				label={"Query Database ID"}
				style={{
					tickLabels: { fontSize: 10, padding: 5, angle: -30, fill: "white" },
					axis: { stroke: "white" },
					axisLabel: { fontSize: 10, padding: 30, fill: "white" },
				}}
			/>
			<VictoryAxis
				label={"Response Duration (ms)"}
				style={{
					tickLabels: { fontSize: 10, padding: 5, fill: "white" },
					axis: { stroke: "white" },
					axisLabel: { fontSize: 10, padding: 30, fill: "white" },
				}}
				dependentAxis
			/>
		</VictoryChart>,
	];

	// Container for bar chart --> Used when there is ONLY ONE path
	const containerBar = [
		<VictoryChart
			domainPadding={{ x: 5 }}
		>
			<VictoryBar
				style={{
					data: { fill: "#189AB4" },
				}}
				// Performance data object inserted here
				data={store.history}
				labels={({ datum }) =>
					`Query: ${datum.t} ms,
				Query String: ${datum.z}`
				}
				barWidth={({ index }) => index * 5 + 20}
				labelComponent={
					<VictoryTooltip
						cornerRadius={5}
						flyoutStyle={{ fill: "#D4F1F4" }}
						style={{ fontSize: 6 }}
						constrainToVisibleArea
						flyoutPadding={5}
					/>
				}
			/>
			<VictoryAxis
				label={"Query Database ID"}
				style={{
					tickLabels: { fontSize: 10, padding: 5, fill: "white" },
					axis: { stroke: "white" },
					axisLabel: { fontSize: 10, fill: "white" },
				}}
			/>
			<VictoryAxis
				label={"Response Duration (ms)"}
				style={{
					tickLabels: { fontSize: 10, padding: 5, fill: "white" },
					axis: { stroke: "white" },
					axisLabel: { fontSize: 10, fill: "white" },
				}}
				dependentAxis
			/>
		</VictoryChart>,
	];

	// Conditional statement to assign chartContainer to charting (line or bar) if there is data, or else, a string indicating no data to render
	if (store.history.length === 0) {
		chartContainer = '(No historical query information to display)';
	} else if (store.history.length === 1) {
		chartContainer.push(containerBar);
	} else {
		chartContainer.push(containerLine);
	}

	const headerStr = 'Historical GraphQL Performance (Overall response duration in ms)'

	const linkStyle = {
		"color": "#05445E",
		"textDecoration": "none",
	}

	return (
		// <div>
			<div className="historyViewContainer">
				<img src="./logo2.png" />
				<button className="quadrantButton">
					<Link to="/" style={linkStyle}>Home</Link>
				</button>
				<h3 style={{ "color": "#ffffff" }}>{headerStr}</h3>
				<div style={{ "width": "80%", "color": "#ffffff", "textAlign": "center", "marginTop": "50px" }}>
					{chartContainer}
				</div>
			</div>
		// </div>
	);

}

export default History;
