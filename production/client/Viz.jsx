import React, { useState, useEffect } from 'react';
import Graph from "react-graph-vis";


// vis-network.esm.min.js:37 
/*
//child nodes are properties of a type node. these will have values of strings or numbers.
//connection nodes are other data types, create a new type node. 
//edge will be between 2 type nodes.
*/


function GraphViz() {
  const [graph, setGraph] = useState(
    {
      nodes: [
        { id: 1, label: "Query", title: "node 1 tootip text", color: 'red', heightConstraint: {
          minimum: '50'
        }, title: 'DATA GOES HERE', font: {
          size: 20
        }, shape: 'circle'
      
      },
        { id: 2, label: "Node 2", title: "node 2 tootip text", color: 'green' },
        { id: 3, label: "Node 3", title: "node 3 tootip text" },
        { id: 4, label: "Node 4", title: "node 4 tootip text" },
        { id: 'hello', label: "hello", title: "node 5 tootip text" },
        { id: 6, label: "Node 6", }
  
      ],
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 4 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 2, to: 'hello' },
        { from: 1, to: 6 },
      ]
    },
  );
   const [options, setOptions] = useState(
    {
      // layout: {
      //   hierarchical: true
      // },
      physics:{
        enabled: true,
      },
      nodes: {
        shape: 'circle'
      },
      interaction: {
        hover: true,
        zoomView: true,
      },
      // interaction: {
      //   dragNodes: false,
      //   dragView: true,
      //   hideEdgesOnDrag: false,
      //   hideNodesOnDrag: false,
      //   hover: true,
      //   hoverConnectedEdges: false,
      //   keyboard: {
      //       enabled: false
      //   },
      //   multiselect: false,
      //   navigationButtons: false,
      //   selectable: true,
      //   selectConnectedEdges: false,
      //   zoomView: true
      // },
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
    // events: {
    //   select: function(event) {
    //     console.log(event)
    //     const { nodes, edges } = event;
    //     console.log("Selected nodes:");
    //     console.log(nodes[0]);
    //     // let nodeid = this.state.network.getNodeAt( event.pointer.DOM );
    //     // console.log('here is id', nodeid)
    //     event.stopPropagation()
    //     }
      
    // },

    // network: null,

    function clickSchema() {
      fetch('http://localhost:3000/getSchema')
      .then((res) => {
        return res.json()
      })
      .then((data)=>{
        console.log('Updated schema: ')
        // console.log(data)
        const arrTypes = data.schemaNew.split(/}/);
        const formatted = arrTypes.map((type)=>{
          const split = type.split(/\n/);
          return split.map((field)=>{
            const trimmed = field.trim();
            return trimmed;
          })
        })
        console.log('Formatted', formatted)
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
        // console.log("queryArr", queryArr)
        const setQuery = new Set();
        queryArr.forEach((el)=>{
          // split element via ":" and grab last element
          if (el.includes(":")) {
            const elSplit = el.split(':');
            const lastElSplit = elSplit[elSplit.length-1];
            // console.log(typeof lastElSplit)
            const regex = /[A-Za-z]+/;
            const found = lastElSplit.match(regex);
            // console.log('found', found[0]);
            setQuery.add(found[0])
          }
          
        })
        //check that index !== query or mutation index
        const queryObject = {};
        formatted.forEach((el, i)=>{
          let queryName;
          if (i !== queryIndex && i !== mutationIndex){
            for (let i = 0; i < el.length; i++){
              if (el[i].includes("type")) {
                let fieldSplit = el[i].split("type");
                // console.log('fieldSplit', fieldSplit);
                let field = fieldSplit[fieldSplit.length-1];
                const regex = /[A-Za-z]+/;
                const found = field.match(regex);
                queryName = found[0];
                // console.log('queryName', queryName)
                queryObject[queryName] = {};
                // console.log('queryObj', queryObject)
                break;
              }
            } 
            el.forEach((prop) => {
              if (prop.includes(":")){
                let propSplit = prop.split(":");
                // console.log('propsplit', propSplit[0]);
                let fieldName = propSplit[0];
                if (propSplit[1].includes("[")) {
                  const regex = /[A-Za-z]+/;
                  const found = propSplit[1].match(regex);
                  queryObject[queryName][fieldName] = found[0];
                } else {
                  queryObject[queryName][fieldName] = true;
                  console.log('queryObject', queryObject)
                }
              }
            })
          }
        })
        // SAVE QUERYOBJECT IN THE DATABASE
        const vizNodes = [];
        const vizEdges = [];
        const queryNode = {id: "Query", label: "Query", title: "TBD" }
        vizNodes.push(queryNode)
        for (let key in queryObject){
          const node = {id: key, label: key, title: key};
          vizNodes.push(node);
          vizEdges.push({from: "Query", to: key})
          const prop = key;
          console.log('PROP',prop)
          for (let childNode in queryObject[prop]) {
            console.log('key', prop)
            console.log('childNode', childNode)
            const subNode = {id: prop + '.' + childNode, label: prop + '.' + childNode, title: prop + '.' + childNode};
            vizNodes.push(subNode);
            vizEdges.push({from: prop, to: prop + '.' + childNode})
          }
          // { from: 1, to: 4 },
        }
       console.log('nodes', vizNodes);
       console.log('edges', vizEdges);
        setGraph({nodes: vizNodes, edges: vizEdges})
      })
    }




    return (
      <div>
      <button onClick={clickSchema}>vis.js Schema update</button>
      <Graph
        graph={graph}
        options={options}
        events={events}
        // ref={ref => (this.g = ref)}
        // getNetwork={network => {
        //   //  if you want access to vis.js network api you can set the state in a parent component using this property
        //   this.setState({ network })
        // }}
      />
      </div>
    );
}

export default GraphViz