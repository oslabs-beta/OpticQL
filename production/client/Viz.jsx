import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';
import Graph from "react-graph-vis";

function GraphViz() {
  const { store } = useContext(Context);
  const [net, setNet] = useState({}) 
  const [graph, setGraph] = useState(
    {
      nodes: [{id: 1, label: 'Click Update Schema', title: 'Click Update Schema', font: {size: 18}, color: 'rgba(255, 102, 102, 1)'}], 
      edges: []
    },
  );
  const [options, setOptions] = useState(
    {
      layout: {
        improvedLayout: true
      },
      physics:{
        enabled: true,
      },
      nodes: {
        shape: 'circle',
      },
      interaction: {
        hover: true,
        zoomView: true,
      },
      manipulation: {
        enabled: false,
      },
      clickToUse: false,
      edges: {
        color: "#000000"
      },
      height: "600px",
      width: "700px"
    },
   )
  const [events, setEvents] = useState({});
  const [convert, setConvert] = useState({})

    function clickSchema() {
        const arrTypes = store.schema.schemaNew.split(/}/);
        const formatted = arrTypes.map((type)=>{
          const split = type.split(/\n/);
          return split.map((field)=>{
            const trimmed = field.trim();
            return trimmed;
          })
        })
        let queryArr;
        let queryIndex;
        let mutationIndex;
        formatted.forEach((el, i)=>{
          const elJoin = el.join("");
          if(elJoin.includes("Query")) {
            queryArr = el;
            queryIndex = i;
          }
          if(elJoin.includes("Mutation")) {
            mutationIndex = i;
          }
        })
        const setQuery = new Set();
        const queryConvert = {};
        queryArr.forEach((el)=>{
          if (el.includes(":")) {
            const elSplit = el.split(':');
            const lastElSplit = elSplit[elSplit.length-1];
            const regex = /[A-Za-z]+/;
            const found = lastElSplit.match(regex);
            setQuery.add(found[0])
            const left = elSplit[0];
            const leftName = left.split("(");
            queryConvert[leftName[0]] = found[0];
          }
        })
        // convert looks at the type of query ('people', 'person') and converts it to schema 'Type' (Person)
        setConvert(queryConvert);
        const queryObject = {};
        formatted.forEach((el, i)=>{
          let queryName;
          if (i !== queryIndex && i !== mutationIndex){
            for (let i = 0; i < el.length; i++){
              if (el[i].includes("type")) {
                let fieldSplit = el[i].split("type");
                let field = fieldSplit[fieldSplit.length-1];
                const regex = /[A-Za-z]+/;
                const found = field.match(regex);
                queryName = found[0];
                queryObject[queryName] = {};
                break;
              }
            } 
            el.forEach((prop) => {
              if (prop.includes(":")){
                let propSplit = prop.split(":");
                let fieldName = propSplit[0];
                if (propSplit[1].includes("[")) {
                  const regex = /[A-Za-z]+/;
                  const found = propSplit[1].match(regex);
                  queryObject[queryName][fieldName] = found[0];
                } else {
                  queryObject[queryName][fieldName] = true;
                }
              }
            })
          }
        })
        const vizNodes = [];
        const vizEdges = [];
        const queryNode = {id: "Query", label: "Query", title: "TBD", color: 'rgba(90, 209, 104, 1)', widthConstraint:75, font: {size: 20, align: 'center'}}
        vizNodes.push(queryNode)
        const colorArr = ['rgba(255, 153, 255, 1)','rgba(75, 159, 204, 1)','rgba(255, 102, 102, 1)','rgba(255, 255, 153, 1)','rgba(194, 122, 204, 1)', 'rgba(255, 204, 153, 1)', 'rgba(51, 204, 204, 1)']
        let colorPosition = 0;
        for (let key in queryObject){
          const node = {id: key, label: key, title: key, group: key, widthConstraint: 75, color: colorArr[colorPosition], font: {size: 16, align: 'center'}};
          vizNodes.push(node);
          vizEdges.push({from: "Query", to: key, length: 275})
          const prop = key;
          for (let childNode in queryObject[prop]) {
            const subNode = {id: prop + '.' + childNode, label: childNode, title: prop + '.' + childNode, group: prop, widthConstraint: 35, color: colorArr[colorPosition], font: {size: 10, align: 'center'}};
            vizNodes.push(subNode);
            vizEdges.push({from: prop, to: prop + '.' + childNode})     
          }
          colorPosition += 1;
        }
       console.log('nodes', vizNodes);
       console.log('edges', vizEdges);
        setGraph({nodes: vizNodes, edges: vizEdges})
    }

    useEffect(() => {
      const greenObj = {};
      const queryRes = store.query.data;
      const recHelp = (data) => {
        for (let key in data) {
          let val;
          if (key in convert) {
            val = convert[key];
            greenObj[val] = true
            // If data[key][0] has a value of null:
            let newData; 
            let count = 0;
            while (!data[key][count]) {
              count += 1;
            }
            newData = data[key][0];
            for (let prop in newData) {
              const propValue = val + '.' + prop
              greenObj[propValue] = true;
              if (Array.isArray(newData[prop])) {
                const newObj = {};
                newObj[prop] = newData[prop];
                recHelp(newObj)
              }
            }
          } 
        }   
      }

      if (queryRes) {
        recHelp(queryRes)
        const newNodeArr = []
        graph.nodes.forEach((el, i)=> {
          // check if value is a key in greenObj, it true, turn its node color green
          if (greenObj[el.id]) {
            el.color = 'rgba(90, 209, 104, 1)'
            el.title = 'CHANGED'
            newNodeArr.push(el);
          } else {
            newNodeArr.push(el);
          }
        })
        const edgesArr = graph.edges;
        net.network.setData({
          edges: edgesArr , 
          nodes: newNodeArr,
        });
      }
    }, [store.query.data])

    return (
      <div>
      <button onClick={clickSchema}>vis.js Schema update</button>

      <Graph
        graph={graph}
        options={options}
        events={events}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
          setNet({ network })
        }}
      />
      </div>
    );
}

export default GraphViz