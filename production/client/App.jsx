import React, { useReducer } from 'react';
import { Switch, Route } from "react-router-dom";
import { Context, initialState, reducer } from './store.jsx';
import FullVizView from './fullVizView.jsx';
import QuadrantView from './quadrantView.jsx';
// import Error from './error.jsx'

const App = () => {
	const [store, dispatch] = useReducer(reducer, initialState)
	return (
		<main>
			<Context.Provider value={{ store, dispatch }}>
			<Switch>
				<Route path="/fullviz" component={FullVizView} />
				{/* <Route component={Error} /> */}
				<Route path="*" component={QuadrantView} />
				<Route path="/" component={QuadrantView} exact />
			</Switch>
			</Context.Provider>
		</main>
	)

}

export default App;
