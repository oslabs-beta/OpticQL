import React, { PureComponent } from 'react';
import TestWindow from './testWindow.jsx';

class ExpandPerfData extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render () {

		function numberWithCommas (x) {
			return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
		}

		const container = [];

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

		for (let path in this.props.performance) {

			let pathArr = this.props.performance[path];

			const innerContainer = [];

			for (let i = 0; i < pathArr.length; i++) {
				let finalNum = numberWithCommas((pathArr[i][1] / 1000000).toFixed(4));
				const str = `${pathArr[i][0]} : ${finalNum} ms`;

				let styleToApply;

				if (finalNum > this.props.performanceAvg[path]) {
					styleToApply = liStyleRed;
				} else {
					styleToApply = liStyleBlack;
				}

				innerContainer.push(<li style={styleToApply}>{str}</li>)
			}

			const pathHeader = (<h2 key={path}>{path}</h2>);
			const subHeaderOne = (<h4 key={`${path}: subheadingOne`} style={subHeadStyle}>Total # of Resolvers: {this.props.performance[path].length}</h4>);
			const subHeaderTwo = (<h4 key={`${path}: subheadingTwo`} style={subHeadStyle}>Total # of outlier resolvers (highlighted in red): {this.props.anomaliesObject[path].length}</h4>);
			container.push(<div style={styleInnerDiv}>{pathHeader}{subHeaderOne}{subHeaderTwo}<ul>{innerContainer}</ul></div>);
		}

		return (
			<div>
				{this.props.showWindow && (
					<TestWindow>
						{/* <pre><code>{JSON.stringify(this.props.performance, null, 2)}</code></pre> */}
						<div style={styleSheet}>
							<h1 style={styleHeader}>Expanded Performance Metrics</h1>
							{container}
						</div>
					</TestWindow>)}
			</div>
		);
	}
}

export default ExpandPerfData;