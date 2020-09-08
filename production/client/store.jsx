import React from 'react';

<<<<<<< HEAD
export const initialState = { query: {} , schema: {} }
=======
export const initialState = {
	query: {},
	newVal: '',
}
>>>>>>> master

export const reducer = (state, action) => {
	switch (action.type) {
		case "reset":
			return initialState
		case "updateQuery":
      return { ...state , query: action.payload }
    case "updateSchema": 
      return { ...state , schema: action.payload }
		default:
			return state
	}
}

export const Context = React.createContext();
