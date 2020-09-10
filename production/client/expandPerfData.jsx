import React, { PureComponent } from 'react';
import TestWindow from './testWindow.jsx';

class ExpandPerfData extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			val: 'hi',
		};
		// this.toggleWindowPortal = this.toggleWindowPortal.bind(this);
	}

	render () {
		// console.log("this.state.perfObj:", this.props.performance)
		return (
			<div>
				{this.props.showWindow && (
					<TestWindow>
						<pre><code>{JSON.stringify(this.props.performance, null, 2)}</code></pre>
					</TestWindow>)}
			</div>
		);
	}
}

export default ExpandPerfData;