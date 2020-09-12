import React from 'react';
import { useHistory, Link } from 'react-router-dom';

const NavBar = () => {
	// remember to ask patrick and rebecca for the logo code
	const newLocation = (e) => {
		e.preventDefault();
		window.location.href = '/history'
	}

	return (
		<div>
			<Link to="/">Home </Link>
			<button style={{ "backgroundColor": 'white' }}>
				<Link to="/history">Historical Performance</Link>
			</button>

			{/* <button component={Link} to="/history">
				Click Me
</button> */}

		</div>
	);
}

export default NavBar;
