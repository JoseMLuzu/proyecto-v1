import React from "react";
import '../../styles/footer.css';

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center">
		<div className="container">
			<div className="row">
				<div className="col-md-4">
					<h5>About Us</h5>
					<p>
						We provide comprehensive financial management tools to help you track and analyze your investments and expenses.
					</p>
				</div>
				<div className="col-md-4">
					<h5>Quick Links</h5>
					<ul className="list-unstyled">
						<li><a href="/cryptos">Cryptos</a></li>
						<li><a href="/stocks">Stocks</a></li>
						<li><a href="/services">Services</a></li>
						<li><a href="/contact">Contact Us</a></li>
					</ul>
				</div>
				<div className="col-md-4">
					<h5>Follow Us</h5>
					<a href="https://facebook.com" className="me-2"><i className="fab fa-facebook"></i></a>
					<a href="https://twitter.com" className="me-2"><i className="fab fa-twitter"></i></a>
					<a href="https://instagram.com" className="me-2"><i className="fab fa-instagram"></i></a>
					<a href="https://linkedin.com"><i className="fab fa-linkedin"></i></a>
				</div>
			</div>
			<hr className="my-3" />
			<p className="mb-0">
				&copy; {new Date().getFullYear()} Your Company. All Rights Reserved.
			</p>
			
		</div>
	</footer>
);
