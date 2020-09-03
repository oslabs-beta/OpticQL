import React, { useState, Component } from 'react';
import { useIndexedDB } from 'react-indexed-db';


const App = (props) => {
  
  const db = useIndexedDB('queryData');
  const [query, setQuery] = useState();

  const newQuery = `{
    people {
      gender
    }
  }`

  function makeQuery() {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: newQuery,
      })
    })
    .then(res => res.json())
    .then(res => {
      console.log("This is the response: ", res);
      setQuery(res);
    })
    .catch(err => console.log("This is the error: ", err));
  }

  function databaseInsert() {
    
    db.add({ name: query })
      .then(id => {
        console.log('ID Generated: ', id);
      })
      .catch(err => console.log("Error with database insertion: ", err))
  };

  function databaseGrab() {
    db.getAll()
    .then(result => console.log(result))
    .catch(err => console.log("Error with getting all records from database: ", err));
  };

  return (
    <div>
      React is working.
      <button onClick={makeQuery}>Click here for fetch</button>
      <button onClick={databaseInsert}>Upload Schema</button>
      <button onClick={databaseGrab}>Read Schema</button>
    </div>
  )
}

export default App;