import React from 'react';
import { Switch, Route } from "react-router-dom";
import FullVizView from './fullVizView.jsx'
import QuadrantView from './quadrantView.jsx'
// import Error from './error.jsx'

const App = () => {

	return (
		<main>
			<Switch>
				<Route path="/" component={QuadrantView} exact />
				<Route path="/fullviz" component={FullVizView} />
				{/* <Route component={Error} /> */}
				<Route path="*" component={QuadrantView} />
			</Switch>
		</main>
	)

}

export default App;
