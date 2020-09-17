import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {

	// REMEMBER TO ASK PATRICK AND REBECCA FOR RE-INSERTION OF THE LOGO

	const linkStyle = {
		"color": "#05445E",
		"text-decoration": "none",
	}

	return (
		<div className="navigation">
			<button className="navButtons">
				<Link to="/" style={linkStyle}>Home</Link>
			</button>
			<button className="navButtons">
				<Link to="/fullviz" style={linkStyle}>Full Viz</Link>
			</button>
		</div>
	);
}

export default NavBar;
