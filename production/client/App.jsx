import React, { useState, Component } from 'react';
import ControlPanel from './controlpanel.jsx';
import GraphViz from './Viz.jsx'

const App = () => {

	return (
		<div>
			React is working.
			<ControlPanel />
      <GraphViz />
		</div>
  )
}

export default App
