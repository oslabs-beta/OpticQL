import React, { PureComponent } from 'react';
import TestWindow from './testWindow.jsx';

class ExpandPerfData extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render () {

		// Function to cleanly format response time string with commas
		function numberWithCommas (x) {
			return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
		}

		// Final variable that is rendered inside the return statement
		let insertionContainer;

		// Render the information inside container if the request is a query
		const container = [];

		// Render this string if the request is a mutation
		let noResponseStr = '(No additional performance data to show)'

		const styleSheet = {
			"display": "flex",
			"flex-direction": "column",
			"backgroundColor": "#05445E",
			"padding": "10px",
		};

		const styleHeader = {
			"color": "white",
			"display": "flex",
			"justify-content": "center",
		};

		const styleInnerDiv = {
			"backgroundColor": "#D4F1F4",
			"display": "flex",
			"flex-direction": "column",
			"padding": "10px",
			"margin": "5px",
			"border": "2px solid white",
		};

		const liStyleRed = {
			"color": "red",
			"fontWeight": "bold",
		};

		const liStyleBlack = {
			"color": "black",
		};

		const subHeadStyle = {
			"padding": "0",
			"margin": "0",
		};

		// Creating an array to display performance metrics for each resolver path via popup window
		for (let path in this.props.performance) {

			// Saving each resolver path's array (each array containing the path's individual field-level resolvers) to a variable
			let pathArr = this.props.performance[path];

			const innerContainer = [];

			// For loop through resolver path's array to cleanly format field-level resolver and response duration into a string, pushing into a li HTML tag stored in innerContainer 
			for (let i = 0; i < pathArr.length; i++) {
				let finalNum = numberWithCommas((pathArr[i][1] / 1000000).toFixed(4));
				const str = `${pathArr[i][0]} : ${finalNum} ms`;

				let styleToApply;

				// Conditional formatting to turn string 'red' if the resolver duration is above the average for that resolver path
				if (finalNum > this.props.performanceAvg[path]) {
					styleToApply = liStyleRed;
				} else {
					styleToApply = liStyleBlack;
				}

				innerContainer.push(<li style={styleToApply}>{str}</li>)
			}

			const pathHeader = (<h2 key={path}>{path}</h2>);
			// Overall statistics to show total resolvers in popup window
			const subHeaderOne = (<h4 key={`${path}: subheadingOne`} style={subHeadStyle}>Total # of Resolvers: {this.props.performance[path].length}</h4>);
			// Overall statistics to show total outliers in popup window
			const subHeaderTwo = (<h4 key={`${path}: subheadingTwo`} style={subHeadStyle}>Total # of outlier resolvers (highlighted in red): {this.props.anomaliesObject[path].length}</h4>);
			container.push(<div style={styleInnerDiv}>{pathHeader}{subHeaderOne}{subHeaderTwo}<ul>{innerContainer}</ul></div>);
		}

		// Conditional statement whether to render resolver path data, or if none exists (it's a mutation), then render the noResponseStr
		if (container.length > 0) {
			insertionContainer = container;
		} else {
			insertionContainer = (<h2 style={{ "color": "white", "textAlign": "center" }}>{noResponseStr}</h2>)
		}

		return (
			<div>
				{this.props.showWindow && (
					<TestWindow>
						{/* <pre><code>{JSON.stringify(this.props.performance, null, 2)}</code></pre> */}
						<div style={styleSheet}>
							<h1 style={styleHeader}>Expanded Performance Metrics</h1>
							{insertionContainer}
						</div>
					</TestWindow>)}
			</div>
		);
	}
}

export default ExpandPerfData;