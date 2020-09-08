import React, { useState, useEffect, useContext } from 'react';
import { Context } from './store.jsx';

const NavBar = () => {
return (
	<div>
    <div id="buttonContainer">
      <button>Button1</button>
      <button>Button2</button>
    </div>
    <div id='title'>
		  <h1>OpticQL</h1>
    </div>
	</div>
);
}
export default NavBar;