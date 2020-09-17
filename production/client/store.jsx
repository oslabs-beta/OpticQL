import React from 'react';

export const initialState = {
	query: {},
	schema: {},
	loading: false,
	history: [],
}

export const reducer = (state, action) => {
	switch (action.type) {
		case "reset":
			return initialState
		case "updateQuery":
			return { ...state, query: action.payload }
		case "updateSchema":
			return { ...state, schema: action.payload }
		case "updateLoading": {
			return { ...state, loading: action.payload }
		}
		case "saveHistory": {
			return { ...state, history: action.payload }
		}
		default:
			return state
	}
}

export const Context = React.createContext();
