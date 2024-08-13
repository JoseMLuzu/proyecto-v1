import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
	
	return (
		<nav className="navbar">
			<div className="container">
				<Link to="/">
					<div className="navbar-brand mb-0 h1"></div>
				</Link>
				<div className="ml-auto">
				<Link to="/login">
						<button className="btn btn-dark my-3 me-2 navlogin">Login</button>
					</Link>
					<Link to="/register">
						<button className="btn btn-outline-light my-3 navregister">Register</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};
