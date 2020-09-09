import React, { useContext } from "react";
import { Context } from "./store.jsx";
import {
  VictoryChart,
  VictoryTheme,
  VictoryZoomContainer,
  VictoryLine,
  VictoryAxis,
  VictoryBar,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";

const PerfData = () => {
  const { store } = useContext(Context);

  const perfObj = {};
  // {
  //   people.gender: [[people.0.gender, duration], [people.1.gender, duration]]
  //   people.name: [[people.0.name, duration], [people.1.name, duration]]
  //   people.films: [[people.0.films, duration], [people.1.films, duration]]
  //   people.films._id:
  // }
  const topLevelQueryArr = [];
  const perfAvg = {};
  // {
  // people.gender: avg,
  // people.name: avg,
  // people.films: avg
  // }

  let data;
  let container = [];

  if (store.query.extensions) {
    // Top-level query information
    const performanceDataArray =
      store.query.extensions.tracing.execution.resolvers;
    const overallResTime = store.query.extensions.tracing.duration;

    // Resolver-level query information
    for (let i = 0; i < performanceDataArray.length; i++) {
      const currResolver = performanceDataArray[i];

      if (currResolver.path.length === 1) {
        const pathStr = currResolver.path[0];
        const pathDuration = currResolver.duration;
        topLevelQueryArr.push([pathStr, pathDuration]);
      } else {
        const pathStrJoined = currResolver.path.join(".");

        const pathKey = currResolver.path.filter(function (curEl) {
          return typeof curEl === "string";
        });

        const pathKeyJoined = pathKey.join(".");

        if (perfObj[pathKeyJoined]) {
          perfObj[pathKeyJoined].push([pathStrJoined, currResolver.duration]);
        } else {
          perfObj[pathKeyJoined] = [[pathStrJoined, currResolver.duration]];
        }
      }
    }

    for (let perfQuery in perfObj) {
      let perfArr = perfObj[perfQuery];
      let average = 0;
      for (let i = 0; i < perfArr.length; i++) {
        average += perfArr[i][1];
      }
      const finalAvg = average / perfArr.length / 1000000;
      perfAvg[perfQuery] = Number(finalAvg.toFixed(4));
    }

    console.log("perfObj ", perfObj);
    console.log("topLevelQueryArr ", topLevelQueryArr);
    console.log("performanceAvg:", perfAvg);

    data = [];
    //data is {[pathname:avgTime],[Pathname:avgTime],[Pathname:avgTime]}

    const anomaliesObj = {};

    for (const [pathName, avg] of Object.entries(perfAvg)) {
      const anomaliesArr = [];

      const arrayOfTimes = perfObj[pathName];

      arrayOfTimes.forEach((el) => {
        const resTime = el[1] / 1000000;
        if (resTime > avg) {
          anomaliesArr.push(`${el[0]}: ${resTime} ms`);
        }
      });

      anomaliesObj[pathName] = anomaliesArr;
    }

    for (let queryKey in perfAvg) {
      let queryKeyObj = {};
      queryKeyObj.x = queryKey;
      queryKeyObj.y = perfAvg[queryKey];
      queryKeyObj.z = anomaliesObj[queryKey];
      data.push(queryKeyObj);
    }

    console.log("DATA DATA: ", data);
    //perfAvg=
    // {
    // people.gender: avg,
    // people.name: avg,
    // people.films: avg
    // }
    //    [{x: people.films.avg, y: avg},{},{}]

    //perfObg =
    // {
    //   people.gender: [[people.0.gender, duration], [people.1.gender, duration]]
    //   people.name: [[people.0.name, duration], [people.1.name, duration]]
    //   people.films: [[people.0.films, duration], [people.1.films, duration]]
    //   people.films._id:
    // }

    //container line chart
    const containerLine = [
      <VictoryChart
        // theme={VictoryTheme.material}
        domainPadding={{ x: 10 }}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiDimension="x"
            labels={({ datum }) => `No. of anomalies: ${datum.z.length}`}
            labelComponent={
              <VictoryTooltip
                flyoutHeight={30}
                cornerRadius={0}
                flyoutStyle={{ fill: "yellow" }}
              />
            }
          />
        }
      >
        <VictoryLine
          style={{
            labels: { fontSize: 6 },
            data: { stroke: "#c43a31" },
            parent: { border: "1px solid #ccc" },
          }}
          data={data}
          labels={({ datum }) => `Avg.: ${datum.y}`}
        />
        <VictoryAxis
          style={{
            tickLabels: { fontSize: 6, padding: 5 },
          }}
        />
        <VictoryAxis
          style={{
            tickLabels: { fontSize: 6, padding: 5 },
          }}
          dependentAxis
        />
      </VictoryChart>,
    ];

    const containerBar = [
      <VictoryChart
        // theme={VictoryTheme.material}
        domainPadding={{ x: 10 }}
        containerComponent={<VictoryZoomContainer />}
      >
        <VictoryBar
          data={data}
          labels={({ datum }) =>
            `Field: ${datum.x}, Response Time: ${datum.y}, No. of anomalies: ${datum.z.length}`
          }
          barWidth={({ index }) => index * 5 + 20}
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
            tickLabels: { fontSize: 6, padding: 5 },
          }}
        />
        <VictoryAxis
          style={{
            tickLabels: { fontSize: 6, padding: 5 },
          }}
          dependentAxis
        />
      </VictoryChart>,
    ];

    if (data.length === 1) {
      container = containerBar;
    } else {
      container = containerLine;
    }
  }
  return <div>{container}</div>;
};

export default PerfData;
