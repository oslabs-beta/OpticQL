import React, { Component } from 'react';

const App = props => {
  
  function click() {
    fetch('http://localhost:3000/api/hello', {
    })
    .then((res) => {
      console.log(res)
      return res.json()
    })
    .then((data)=>{
      console.log('fetch')
      console.log(data)
    })
  }

  function clickTwo() {
    fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        query: `{
          people {
            gender
          }
        }`
      })
    })
    .then((res) => {
      console.log(res)
      return res.json()
    })
    .then((data)=>{
      console.log('fetch')
      console.log(data)
    })
  }


  return (
    <div>
      REACT IS WORKING
      <button onClick={clickTwo}>Click here for fetch</button>
    </div>
  )
}

export default App;