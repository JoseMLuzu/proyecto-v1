import React from "react";
import '../../styles/footer.css';

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">
		<div className="container">
			<div className="row">
				<div className="col-md-4">
					<h5>About Us</h5>
					<p className="aboutUs">
						We provide comprehensive financial management tools to help you track and analyze your investments and expenses.
					</p>
				</div>
				<div className="col-md-4">
					<h5>Quick Links</h5>
					<ul className="list-unstyled">
						<li><a href="/dashboard">Dashboard</a></li>
						<li><a href="/crypto">Cryptos</a></li>
						<li><a href="/stocks">Stocks</a></li>
						<li><a href="/contact">Contact Us</a></li>
					</ul>
				</div>
				<div className="col-md-4">
					<h5>Follow Us</h5>
					<a href="https://facebook.com" className="me-2" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook"></i></a>
					<a href="https://twitter.com" className="me-2" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i></a>
					<a href="https://instagram.com" className="me-2" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
					<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
				</div>

			</div>
			<hr className="my-3" />
			<p className="mb-0 rights">
				&copy; {new Date().getFullYear()} LogTrack. All Rights Reserved.
			</p>

		</div>
	</footer>
);
