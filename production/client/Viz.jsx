import React, { Component } from 'react';
import Graph from "react-graph-vis";


// vis-network.esm.min.js:37 
/*
//child nodes are properties of a type node. these will have values of strings or numbers.
//connection nodes are other data types, create a new type node. 
//edge will be between 2 type nodes.
*/

function clickSchema() {
  fetch('http://localhost:3000/getSchema')
  .then((res) => {
    return res.json()
  })
  .then((data)=>{
    console.log('Updated schema: ')
    // console.log(data)
    const arrData = data.schemaNew.split(/}/);
    console.log(arrData)
    const arrData2 = arrData.map((el)=>{
      const split = el.split(/\n/);
      split.forEach((el)=>{
        el.trim();
      })
      return split;
    })
    console.log(arrData2)

  })
}



class GraphViz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      graph: {
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
          { id: 5, label: "Node 5", title: "node 5 tootip text" },
          { id: 6, label: "Node 6", }
    
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 1, to: 4 },
          { from: 1, to: 3 },
          { from: 2, to: 4 },
          { from: 2, to: 5 },
          { from: 1, to: 6 },
        ]
      },
     
      options: {
        layout: {
          hierarchical: true
        },
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

    }
  }



  render () {
    return (
      <div>
      <button onClick={clickSchema}>vis.js Schema update</button>
      <Graph
        graph={this.state.graph}
        options={this.state.options}
        events={this.state.events}
        // ref={ref => (this.g = ref)}
        getNetwork={network => {
          //  if you want access to vis.js network api you can set the state in a parent component using this property
          this.setState({ network })
        }}
      />
      </div>
    );
  }

}



export default GraphViz