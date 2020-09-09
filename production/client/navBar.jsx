import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';

const NavBar = () => {
return (
	<div>
    {/* <div id="buttonContainer">
      <button className="navButton">Save</button>
      <button className="navButton">History</button>
    </div> */}
    <div id='title'>
		  <h1>OpticQL</h1>
    </div>
	</div>
);
}
export default NavBar;