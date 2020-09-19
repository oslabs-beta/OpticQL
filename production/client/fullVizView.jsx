import React from "react";
import NavBar from './navBar.jsx'
import GraphViz from './Viz.jsx';

const FullViz = () => {
//pass prop GraphViz as true here
	return (
		<div id="fullVizParent">
			<NavBar />
			<div id="fullVizContainer">
			<GraphViz height={"1000px"} width={"100%"} fullGraph={true}/>
			</div>
		</div>
	)
}

export default FullViz;