import React from "react";
import NavBar from './navBar.jsx'
import GraphViz from './graphViz.jsx';

const FullViz = () => {
	// Pass prop GraphViz as true here
	return (
		<div className="fullpageViz">
			<div id='title'>
				<img src="./logo2.png" />
			</div>
			<div id="fullVizParent">
				<div id="fullVizContainer">
					<GraphViz height={"1000px"} width={"100%"} fullGraph={true} />
				</div>
			</div>
		</div>
	)
}

export default FullViz;