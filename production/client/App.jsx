import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import HistoryView from './historyView.jsx'
import QuadrantView from './quadrantView.jsx'
import Error from './error.jsx'

const App = () => {

	return (
		<main>
			<Switch>
				<Route path="/" component={QuadrantView} exact />
				<Route path="/history" component={HistoryView} />
				<Route component={Error} />
			</Switch>
		</main>
	)

}

export default App;
