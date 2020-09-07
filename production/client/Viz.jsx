import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';
import Graph from "react-graph-vis";

// vis-network.esm.min.js:37 
/*
//child nodes are properties of a type node. these will have values of strings or numbers.
//connection nodes are other data types, create a new type node. 
//edge will be between 2 type nodes.
*/



function GraphViz() {
  const { store } = useContext(Context);
  const [net, setNet] = useState({}) 

  const [graph, setGraph] = useState(
    {
      nodes: [
        { id: 1, label: "Query", title: "node 1 tootip text", color: 'red', heightConstraint: '200'
        , title: 'DATA GOES HERE', font: {
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
      layout: {
        improvedLayout: true
      },
      physics:{
        enabled: true,
      },
      nodes: {
        shape: 'circle',
        // widthConstraint: 35,
        // font: {
        //   size: 10,
        // }
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

    const [convert, setConvert] = useState({})

    function clickSchema() {
      console.log("STORE SCHEMA", store.schema)
      // fetch('http://localhost:3000/getSchema')
      // .then((res) => {
      //   return res.json()
      // })
      // .then((data)=>{
        console.log('Updated schema: ')
        // console.log(data)
        const arrTypes = store.schema.schemaNew.split(/}/);
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
        const queryConvert = {};
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
            const left = elSplit[0];
            const leftName = left.split("(");
            queryConvert[leftName[0]] = found[0];
          }
        })
        setConvert(queryConvert);
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
        const queryNode = {id: "Query", label: "Query", title: "TBD", color: 'rgba(90, 209, 104, 1)', widthConstraint:75, font: {size: 20, align: 'center'}}
        vizNodes.push(queryNode)
        const colorArr = ['rgba(255, 153, 255, 1)','rgba(75, 159, 204, 1)','rgba(255, 102, 102, 1)','rgba(255, 255, 153, 1)','rgba(194, 122, 204, 1)', 'rgba(255, 204, 153, 1)', 'rgba(51, 204, 204, 1)']
        let colorPosition = 0;
        for (let key in queryObject){
          const node = {id: key, label: key, title: key, group: key, widthConstraint: 75, color: colorArr[colorPosition], font: {size: 16, align: 'center'}};
          vizNodes.push(node);
          vizEdges.push({from: "Query", to: key, length: 275})
          const prop = key;
          // console.log('PROP',prop)
          for (let childNode in queryObject[prop]) {
            // console.log('key', prop)
            // console.log('childNode', childNode)
            const subNode = {id: prop + '.' + childNode, label: childNode, title: prop + '.' + childNode, group: prop, widthConstraint: 35, color: colorArr[colorPosition], font: {size: 10, align: 'center'}};
            vizNodes.push(subNode);
            vizEdges.push({from: prop, to: prop + '.' + childNode})     
          }
          // { from: 1, to: 4 },
          colorPosition += 1;
        }
       console.log('nodes', vizNodes);
       console.log('edges', vizEdges);
 
        setGraph({nodes: vizNodes, edges: vizEdges})
      // })
    }
    useEffect(() => {
   
      const greenObj = {};
      const queryRes = store.query.data;

      const recHelp = (data) => {
        for (let key in data) {
          let val;
          console.log('KEY-recHelp', key)
          if (key in convert) {
            val = convert[key];
            greenObj[val] = true
            // WHAT IF DATA[KEY][0] HAS A VALUE OF NULL
            let newData; 
            let count = 0;
            while (!data[key][count]) {
              count += 1;
            }
            newData = data[key][0];
            for (let prop in newData) {
              console.log('PROP-recHelp', prop)
              const propValue = val + '.' + prop
              greenObj[propValue] = true;
              if (Array.isArray(newData[prop])) {
                const newObj = {};
                newObj[prop] = newData[prop];
                console.log('NEWOBJ-recHelp', newObj);
                recHelp(newObj)
              }
            }
          } 
        }   
      }

      if (queryRes) {
        console.log('STOREQUERYEFFECT', queryRes)
        // console.log('CONVERT WORKS', convert)
        recHelp(queryRes)
        console.log(greenObj)
        //  { id: 2, label: "Node 2", title: "node 2 tootip text", color: 'green' },
        // setGraph({nodes: [] edges: []})

        // 1. create a new node array
        const newNodeArr = []
        // 2. iterate old nodes array, check if greenObj[oldNode[id]], it exists, turn node green, 
        graph.nodes.forEach((el, i)=> {
          if (greenObj[el.id]) {
            // turn el green
            el.color = 'rgba(90, 209, 104, 1)'
            el.title = 'CHANGED'
            newNodeArr.push(el);
          } else {
            newNodeArr.push(el);


            // // EXTRA RANDOM NODES TO TEST:
            // const idExtra = 100 + i;
            // newNodeArr.push({id: idExtra, title: 'hello', label: 'hello'})


          }
        })
        console.log(newNodeArr)


        const edgesArr = graph.edges;
        
        // setGraph({})


        net.network.setData({
          edges: edgesArr , 
          nodes: newNodeArr,
        });
        
        // setGraph({
        //   edges: edgesArr , 
        //   nodes: newNodeArr,
        // })

    

        console.log('NEW GRAPH', graph)
        // if not just add to new node array
        // 3. Set graph via spread, but have nodes = newNode array
      }
    }, [store.query.data])

    
    // function updateViz (x, y) {
    //   // trigger somethign that updates viz
    //   setGraph({nodes: x, edges: y})
    //   // console.log('updating VIZ: ', graph)
    //   // setGraph({...graph})
    // }
      
    //useEffect when store changes are made
    
    //if store.query !== {}

    //take store.query.data and iterate through items. 

    //grab query types and fields.

    //iterate through visNodes array, compare to nodes in greenObj, and change all nodes in both to green.


      // {
      // people {films {director} gender }
      // planets {name}
      // }


    return (
      <div>
      <button onClick={clickSchema}>vis.js Schema update</button>

      <Graph
        graph={graph}
        options={options}
        events={events}
        // ref={ref => (this.g = ref)}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
          setNet({ network })
        }}
      />
      </div>
    );
}

export default GraphViz