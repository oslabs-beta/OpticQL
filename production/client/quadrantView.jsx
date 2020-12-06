import React from 'react';
import ControlPanel from './controlpanel.jsx';
import QueryDisplay from './queryDisplay.jsx';
import GraphViz from './graphViz.jsx'
import PerformanceData from './performanceData.jsx';
import NavBar from './navBar.jsx'

const QuadrantView = () => {
	return (
		<div>
			<div id='mainContainer'>
				<div id='title'>
					<img src="./logo2.png" />
				</div>
				<div className="row" id='topRow'>
					<div className="quadrant" id="controlPanel">
						<ControlPanel />
					</div>
					<div className="quadrant" id="queryDisplay">
						<QueryDisplay />
					</div>
				</div>
				<div className="row" id="bottomRow">
					<div id="performanceDisplay" className="quadrant2">
						<PerformanceData />
					</div>
					<div id="graphViz" className="quadrant2">
						<GraphViz height={"630px"} width={"100%"} fullGraph={false} />
					</div>
				</div>
        <div className="topQuadrant">
					<NavBar />
				</div>
			</div>
		</div>
	)
}

export default QuadrantView;
