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

  return (
    <div>
      REACT IS WORKING
      <button onClick={click}>Click here for fetch</button>
    </div>
  )
}

export default App;