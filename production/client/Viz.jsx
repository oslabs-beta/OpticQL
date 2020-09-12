import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';
import Graph from "react-graph-vis";
import { useIndexedDB } from 'react-indexed-db';

function GraphViz() {
  const { store, dispatch } = useContext(Context);
  const [net, setNet] = useState({})
  const [savedSchema, saveSchema] = useState();
  const [updatedSchema, updateSchema] = useState(0);
  const [greenNode, greenNodeOn] = useState(false)
  const [events, setEvents] = useState({});
  const [convert, setConvert] = useState({})
  const [graphObjRef, setgraphObjRef] = useState({})
  const schemaDB = useIndexedDB('schemaData');
  const [graph, setGraph] = useState(
    {
      nodes: [], 
      edges: []
    },
  );
  const [graphGreen, setGraphGreen] = useState(
    {
      nodes: [], 
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
        color: '#c8c8c8',
        smooth: {
          enabled: true,
          type: "dynamic",
          // roundness: 0.5
        },
      },
      height: "580px",
      width: "100%",

      autoResize: true,
    },
   )
 

    useEffect(()=>{
      console.log('TRIGGERED WHEN THERE IS A NEW SCHEMA IN THE DATABASE')
      // Triggered when there is a new schema in the database (the useEffect listens for 'updatedSchema'
      // Creates and formats a field for each new line in the schema. Differentiates 'Query' and 'Mutation'
      if (store.schema.schemaNew){
        const arrTypes = store.schema.schemaNew.split(/}/);
        const formatted = arrTypes.map((type)=>{
          const split = type.split(/\n/);
          return split.map((field)=>{
            const trimmed = field.trim();
            return trimmed;
          })
        })
        //Separating query and mutation types from general type fields, 
        // which will be used to create nodes in graph.
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
        // const setQuery = new Set();
        const queryConvert = {};
        // Format object of 'type Query' here
        queryArr.forEach((el)=>{
          if (el.includes(":")) {
            const elSplit = el.split(':');
            const lastElSplit = elSplit[elSplit.length-1];
            const regex = /[A-Za-z]+/;
            const found = lastElSplit.match(regex);
            // setQuery.add(found[0])
            const left = elSplit[0];
            const leftName = left.split("(");
            queryConvert[leftName[0]] = found[0];
          }
        })
        // Convert looks at the type of query ('people', 'person') and converts it to schema 'Type' (Person)
        setConvert(queryConvert);
        const queryObject = {};
        // Now isolate the Non-Query/Mutation type fields 
        formatted.forEach((el, i)=>{
          let queryName;
          if (i !== queryIndex && i !== mutationIndex){
            for (let i = 0; i < el.length; i++){
              // Isolate the 'type' of the field ('Person', 'Film')
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
            // Fill out queryObject with 'queryName' as property and fields as values
            el.forEach((prop) => {
              if (prop.includes(":")){
                let propSplit = prop.split(":");
                let fieldName = propSplit[0];
                if (propSplit[1].includes("[")) {
                  const regex = /[A-Za-z]+/;
                  const found = propSplit[1].match(regex);
                  queryObject[queryName][fieldName] = found[0];
                } else {
                  queryObject[queryName][fieldName] = false;
                }
              }
            })
          }
        })
        const vizNodes = [];
        const vizEdges = [];
        //Creates central query node that connects all field "types"
        const queryNode = {id: "Query", label: "Query", color: 'rgba(90, 209, 104, 1)', widthConstraint:75, font: {size: 20, align: 'center'}}
        vizNodes.push(queryNode)
        const colorArr = ['rgba(255, 153, 255, 1)','rgba(75, 159, 204, 1)','rgba(255, 102, 102, 1)','rgba(255, 255, 153, 1)','rgba(194, 122, 204, 1)', 'rgba(255, 204, 153, 1)', 'rgba(51, 204, 204, 1)']
        let colorPosition = 0;
        for (let key in queryObject){
          const node = {id: key, label: key, title: key, group: key, widthConstraint: 75, color2: colorArr[colorPosition], color: colorArr[colorPosition], font: {size: 16, align: 'center'}};
          vizNodes.push(node);
          vizEdges.push({from: "Query", to: key, length: 275})
          const prop = key;
          for (let childNode in queryObject[prop]) {
            const subNode = {id: prop + '.' + childNode, label: childNode, title: prop + '.' + childNode, group: prop, widthConstraint: 35, color2: colorArr[colorPosition], color: colorArr[colorPosition], font: {size: 10, align: 'center'}};
            vizNodes.push(subNode);
            vizEdges.push({from: prop, to: prop + '.' + childNode})
            // Check if queryObject[prop][childNode] !== true, we can then add connection between 'prop.childNode' to value that is not 'true' 
            // if (queryObject[prop][childNode] !== true) {
            //   vizEdges.push({from: prop + '.' + childNode, to: queryObject[prop][childNode]}) 
            // }    
          }
          colorPosition += 1;
        }
        
        setgraphObjRef(queryObject)
        // if there are green nodes already in graph, update the green nodes via setData

        if (greenNode) {
          greenNodeOn(false)
          net.network.setData({
            edges: vizEdges, 
            nodes: vizNodes,
          });
        } 

        // must use setGraph to re-render the viz with updated green nodes, or with initial data
        setGraph({nodes: vizNodes, edges: vizEdges})
      }
      }, [updatedSchema])

    useEffect(() => {
        // reset green node array

        // if (greenNode) {
        //   net.network.setData({
        //     edges: [], 
        //     nodes: [],
        //   });
        // }
        
        // setgraphObjRef({})

        // setGraphGreen({
        //   nodes: [], 
        //   edges: []
        // },)
      
       

      // listening for change to store.query.data, this will change if new query is executed
      // greenObj will contain all the nodes that should turn green. ('Person', 'Person.gender')
      const greenObj = {};
      const queryRes = store.query.data;
      console.log('QUERY-RES', queryRes)
      const recHelp = (data) => {
        // iterate through queries targeted ('people', 'planets')
        for (let key in data) {
          let val;
          if (key in convert) {
            // turn val into 'Person' if key is 'people'
            val = convert[key];
            greenObj[val] = true
            // If data[key][0] has a value of null:
            let newData; 
            let count = 0;
            while (!data[key][count]) {
              count += 1;
            }
            newData = data[key][count];
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
      // if there has been a query made and a schema is imported
      console.log('    ')
      console.log('GRAPH-NODES', graph.nodes)
      graph.nodes.forEach((el, i)=>{
        if (i !== 0) {
          if (el.color === 'rgba(90, 209, 104, 1)') {
            el.color = el.color2
          }
        }
      })
      // setGraph({...graph, nodes: newGraphNodes})

      if (queryRes && store.schema.schemaNew) {
        // this fills out greenObj with our fields for green nodes
        recHelp(queryRes)
         const newNodeArr = graph.nodes.map((el, i)=> {
          // ISSUE IS THAT GRAPH.NODES HAS OLD GREEN NODES!!!
          // check if value is a key in greenObj, it true, turn its node color green
          if (greenObj[el.id]) {
            el.color = 'rgba(90, 209, 104, 1)'
            // el.title = 'CHANGED'
            return el;
          } else {
            return el;
          }
        })
        const edgesArr = graph.edges;
        // We can now add connections between connector nodes via graphObjRef
        // iterate greenObj, find the value of greenObj key in graphObjRef, and if value is not 'true' add a edge between the value
        // and the key and push ege to edgesArr

        //formats the graphObjRef to have values of "true" or [type]
        const graphObjFormat = {};
        for (let key in graphObjRef) {
          for (let prop in graphObjRef[key]) {
            let value = key + '.' + prop;
            graphObjFormat[value] = graphObjRef[key][prop];
          }
        }

        for (let key in greenObj) {
          console.log('graphObjFormat', graphObjFormat)
          console.log('graphObjFormat-KEY',graphObjFormat[key])
          if (graphObjFormat[key]) {
            // add edge beween value and key
            console.log('SHOULD BE PERSON/FILM', graphObjFormat[key])
            edgesArr.push({from: key, to: graphObjFormat[key]})
          }
        }
        
        console.log('data is being reset here w/ new green nodes:')
        
        if (greenNode) {
          // net.network.setData({
          //   edges: [], 
          //   nodes: [],
          // });
          net.network.setData({
            edges: edgesArr, 
            nodes: newNodeArr,
          });

        }
        else {
          setGraphGreen({
            edges: edgesArr, 
            nodes: newNodeArr,
          })
          greenNodeOn(true);
        }
    

      

      }
    }, [store.query.data])


    // Make query to User App's server API for updated GraphQL schema
	function requestSchema () {
		fetch('http://localhost:3000/getSchema')
			.then(res => res.json())
			.then(res => saveSchema(res))
			.catch(err => console.log('Error with fetching updated schema from User app: ', err));
	}
	// Invokes when savedSchema state is update, sending schema to indexeddb table of schema
	useEffect(() => {
		if (savedSchema) {
			schemaDB.add({ name: savedSchema })
				.then(id => {
					console.log('Schema ID Generated: ', id);
				})
				.catch(err => console.log("Error with schema database insertion: ", err))
				dispatch({
					type: "updateSchema",
					payload: savedSchema
        });
        updateSchema(updatedSchema + 1);
    }
	}, [savedSchema])


    return (
      <div>
      <div className='topLeftButtons' id='vizQuadrant'>
        <button className="quadrantButton" id="updateSchema" key={2} onClick={requestSchema}>Import Schema</button>
        {store.schema.schemaNew && 
          <button className="quadrantButton">View Full Screen</button>
        }
      </div>
      {(store.schema.schemaNew && !greenNode) &&
      <div id='graphBox'>
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
      }

      {(store.schema.schemaNew && greenNode) &&
      <div id='graphBox'>
        <Graph
          graph={graphGreen}
          options={options}
          events={events}
          getNetwork={network => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
            setNet({ network })
          }}
        />
      </div>
      }

      </div>
    );
}

export default GraphViz