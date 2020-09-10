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
      <img src="./assets/logo2.png" />
    </div>
	</div>
);
}
export default NavBar;