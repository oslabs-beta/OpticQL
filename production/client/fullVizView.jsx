import React from "react";
import NavBar from './navBar.jsx'
import GraphViz from './Viz.jsx';

const FullViz = () => {

	return (
		<div>
			<NavBar />
			<GraphViz height={"1000px"}/>
		</div>
	)
}

export default FullViz;