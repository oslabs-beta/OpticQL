import React from 'react';

export const initialState = {
	query: {},
	newVal: '',
}

export const reducer = (state, action) => {
	switch (action.type) {
		case "reset":
			return initialState
		case "updateQuery":
			return { query: action.payload }
		default:
			return state
	}
}

export const Context = React.createContext();
