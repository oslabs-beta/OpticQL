import React, { useContext } from "react";
import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryAxis,
  VictoryStack,
  VictoryZoomContainer,
  VictoryLabel,
  VictoryTooltip,
} from "victory";
import { Context } from "./store.jsx";

const NewChart = () => {
  const { store } = useContext(Context);
  let data;
  let container = [];

  if (store.query.extensions) {
    // Cache object for resolver-level data
    const resolverLevelData = {};

    // Cache object for top-level-query data
    const parentLevelData = {
      overallResponseTime: [
        0,
        store.query.extensions.tracing.duration / 1000000,
      ],
    };

    // Saving the resolver-level-response data array to variable name
    const performanceDataArray =
      store.query.extensions.tracing.execution.resolvers;

    for (let i = 0; i < performanceDataArray.length - 1; i++) {
      const currResolver = performanceDataArray[i];
      // If it is top-level query information, store it in the parentLevelData object
      if (currResolver.path.length === 1) {
        const pathStr = currResolver.path[0];
        parentLevelData[pathStr] = [
          currResolver.startOffset / 1000000,
          currResolver.duration / 1000000,
        ];
      } else {
        // Else, store the elements in the path array and store it in resolverLevelData object
        const pathStr = currResolver.path.join(".");
        resolverLevelData[pathStr] = [
          currResolver.startOffset / 1000000,
          currResolver.duration / 1000000,
        ];
      }
    }

    const resolverContainer = [];

    resolverContainer.push(/* { x: "base", y: 1, y0: 0 } */); // code to insert a "base" record to manually set the x-axis at 0.

    console.log(parentLevelData);

    // Original code ---> iterating forwards the resolverLevelData object
    // for (let queryStr in resolverLevelData) {
    // 	let queryPerfobj = {}
    // 	queryPerfobj.x = queryStr
    // 	queryPerfobj.y = resolverLevelData[queryStr][1] + resolverLevelData[queryStr][0]
    // 	queryPerfobj.y0 = resolverLevelData[queryStr][0]
    // 	resolverContainer.push(queryPerfobj)
    // }

    // Refactored code ---> iterating BACKWARDS through the resolverLevelData object
    const resolverLevelDataArr = Object.entries(resolverLevelData);
    for (let i = resolverLevelDataArr.length - 1; i >= 0; i -= 1) {
      const [key, value] = resolverLevelDataArr[i];
      let queryPerfobj = {};
      queryPerfobj.x = key;
      queryPerfobj.y = value[1] + value[0];
      queryPerfobj.y0 = value[0];
      resolverContainer.push(queryPerfobj);
    }

    data = resolverContainer;

    console.log(resolverContainer);

    // DO NOT DELETE ---> For reference concerning how range bar chart works in Victory library

    // data=[
    //   { x: 1, y: 2, y0: 0 },
    //   { x: 2, y: 3, y0: 2 },
    //   { x: 3, y: 5, y0: 2 },
    //   { x: 4, y: 4, y0: 3 },
    //   { x: 5, y: 6, y0: 3 }
    // ]

    container = [
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 10 }}
        containerComponent={<VictoryZoomContainer />}
      >
        <VictoryBar
          horizontal
          data={data}
          labels={({ datum }) =>
            `Field: ${datum.x}, Response Time: ${datum.y - datum.y0}`
          }
          labelComponent={
            <VictoryTooltip
              dy={0}
              // centerOffset={{ x: 25 }}
              style={{ fontSize: 6 }}
              constrainToVisibleArea
            />
          }
        />
        <VictoryAxis
          style={{
            // axis: { stroke: "#756f6a" },
            // axisLabel: { fontSize: 4, padding: 30 },
            // grid: { stroke: ({ tick }) => (tick > 0.5 ? "red" : "grey") },
            // ticks: { stroke: "grey", size: 1 },
            tickLabels: { fontSize: 4, padding: 5 },
          }}
        />
        <VictoryAxis
          style={{
            // axis: { stroke: "#756f6a" },
            // axisLabel: { fontSize: 4, padding: 30 },
            // grid: { stroke: ({ tick }) => (tick > 0.5 ? "red" : "grey") },
            // ticks: { stroke: "grey", size: 1 },
            tickLabels: { fontSize: 8, padding: 5 },
          }}
          dependentAxis
        />
      </VictoryChart>,
    ];
  }

  return <div>{container}</div>;
};

export default NewChart;
