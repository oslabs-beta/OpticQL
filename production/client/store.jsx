import React from 'react';

export const initialState = {
	query: {},
	schema: {},
	loading: false,
	mutation: false,
	history: [],
	nodes: [],
	edges: [],
	greenNodes: false,
	greenEdges: false,
	fullGraphVisit: false,
	mutationEvent: false,
}

export const reducer = (state, action) => {
	switch (action.type) {
		case "reset":
			return initialState
		case "updateQuery":
			return { ...state, query: action.payload }
		case "updateSchema":
			return { ...state, schema: action.payload }
		case "updateLoading": 
			return { ...state, loading: action.payload }
		case "nodes":
			return { ...state, nodes: action.payload }
		case "edges":
			return { ...state, edges: action.payload }
		case "greenNodes":
			return { ...state, greenNodes: action.payload }
		case "greenEdges":
			return { ...state, greenEdges: action.payload }
		case "mutation":
			return { ...state, mutation: action.payload }
		case "mutationEvent":
			return { ...state, mutationEvent: action.payload }
		case "fullGraphVisit":
			return { ...state, fullGraphVisit: action.payload }
		case "saveHistory": 
			return { ...state, history: action.payload }
		default:
			return state
	}
}

export const Context = React.createContext();
