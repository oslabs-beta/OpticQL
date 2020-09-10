import React, { PureComponent } from 'react';
import TestWindow from './testWindow.jsx';

class ExpandPerfData extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			val: null,
		};
	}

	render () {

		function numberWithCommas (x) {
			return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
		}

		const container = [];

		for (let path in this.props.performance) {

			container.push(<h1 key={path}>{path}</h1>)

			let pathArr = this.props.performance[path]

			const innerContainer = []; // push all of your li tags

			for (let i = 0; i < pathArr.length; i++) {
				let finalNum = numberWithCommas((pathArr[i][1] / 1000000).toFixed(4))
				const str = `${pathArr[i][0]} : ${finalNum} ms`
				innerContainer.push(<li>{str}</li>)
			}

			container.push(<ul>{innerContainer}</ul>)
		}
		return (
			<div>
				{this.props.showWindow && (
					<TestWindow>
						{/* <pre><code>{JSON.stringify(this.props.performance, null, 2)}</code></pre> */}
						<div>
							{container}
						</div>
					</TestWindow>)}
			</div>
		);
	}
}

export default ExpandPerfData;