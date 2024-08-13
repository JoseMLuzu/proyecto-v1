import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();

	const handleLogin = () => {
		navigate("/login");
	};

	const handleRegister = () => {
		navigate("/register");
	};

	return (
		<div className="text-center mt-5">
			<section className="top">
				<div>
					<h2>Your Financial Overview</h2>
					<p>Get a snapshot of your stocks, cryptos, and services spending in one place.</p>
				</div>
			</section>

			<section className="mid">
				<div className="mid-content">
					<h3>Cryptocurrency Overview</h3>
					<p>Track the performance of your favorite cryptocurrencies in real-time.</p>
					<button className="btn btn-primary mt-3">View Cryptos</button>
				</div>
				<div className="mid-content">
					<h3>Stock Market Overview</h3>
					<p>Stay updated with the latest stock prices and market trends.</p>
					<button className="btn btn-primary mt-3">View Stocks</button>
				</div>
				<div className="mid-content">
					<h3>Service Expenses</h3>
					<p>Manage and track your service subscriptions and spending.</p>
					<button className="btn btn-primary mt-3">View Services</button>
				</div>
			</section>

			<section className="low">
				<div>
					<h1>Why Use Our Finance Manager?</h1>
					<div className="item">
						
						<h3>See Your Cryptos in One Place</h3>
						<p>With our app, you can monitor all your cryptocurrencies in one convenient dashboard.</p>
					</div>
					<div className="item">
						
						<h3>See Your Stocks in One Place</h3>
						<p>Keep track of your stock portfolio with real-time data and analytics.</p>
					</div>
					<div className="item">
						
						<h3>Manage Your Services</h3>
						<p>Easily manage and categorize your service expenses to stay on top of your finances.</p>
					</div>
					<div className="item">
						
						<h3>Plan Your Budget</h3>
						<p>Create and monitor budgets to ensure you're on track with your financial goals.</p>
					</div>
					<div className="item">
						
						<h3>Track Your Expenses</h3>
						<p>Keep a detailed record of all your expenses to better manage your finances.</p>
					</div>
					<div className="item">
						
						<h3>Analyze Your Investments</h3>
						<p>Get insights and analytics on your investment performance to make informed decisions.</p>
					</div>
				</div>
			</section>
		</div>
	);
};
