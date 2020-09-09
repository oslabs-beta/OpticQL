import React, { useReducer } from "react";
import { Context, initialState, reducer } from "./store.jsx";
import ControlPanel from "./controlpanel.jsx";
import QueryDisplay from "./queryDisplay.jsx";
import GraphViz from "./Viz.jsx";
import NewChart from "./performanceData.jsx";

const App = () => {
  const [store, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <Context.Provider value={{ store, dispatch }}>
        <ControlPanel />
        <NewChart />
        <QueryDisplay />
        <GraphViz />
      </Context.Provider>
    </div>
  );
};

export default App;
