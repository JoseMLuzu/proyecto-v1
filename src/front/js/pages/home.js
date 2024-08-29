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

    const testimonials = [
        {
            text: (
                <span>
                    <span className="yellow">LogTrack</span> has revolutionized the way I manage my finances. <br />
                    <span className="yellow">Highly recommended!</span>
                </span>
            ),
            author: (
                <strong>
                "Carlos M."
                </strong>
            
            ),
        },
        {
            text: (
                <span>
                    Thanks to <span className="yellow">FinTrack</span>, I now have <span className="yellow">better control</span> <br></br>over my monthly expenses.
                </span>
            ),
            author: (
                <strong>
                "Laura G."
                </strong>
            
            ),
        },
        {
            text: (
                <span>
                    The interface is so <span className="yellow">easy to use</span>, <br />and I love being able to <span className="yellow">track my cryptocurrencies!</span>
                </span>
            ),
            author: (
                <strong>
                "Juan P."
                </strong>
            
            ),
        },
    ];

    return (
        <div className="body">
            <section className="top d-flex align-items-center">
                <div className="row w-100">
                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                        <div className="tittle-top">
                            <h1 className="firstTittle">Your <br></br> <span className="yellow">Financial</span> <br></br>Overview in <span className="yellow">one place</span></h1>
                            <button className="btn btn-primary mt-5 btn-lg" onClick={handleRegister}>Let's Start</button>
                        </div>
                    </div>
                    <div className="col-md-6 d-flex flex-column align-items-center justify-content-center mb-5">
                        <div className="image-top text-center">
                            <h1 className="secondTittle mb-5">Welcome to <span className="yellow">FinTrack</span></h1>
                            <img src='https://cdn.prod.website-files.com/5e51b3b0337309d672efd94c/5e5346352c16e8d69e1649f2_cover_hero-1.svg' alt="Hero Image" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </section>


            <section className="low">
                <div>
                    <h1 className="tittleLow mt-5"><strong>Why Use Our Finance Manager?</strong></h1>
                    <div className="item">
                        <img src="https://static.thenounproject.com/png/5880786-200.png" alt="Budget Icon" />
                        <h3>See Your Cryptos in One Place</h3>
                        <p>With our app, you can monitor all your cryptocurrencies in one convenient dashboard.</p>
                    </div>
                    <div className="item">
                        <img src="https://static.thenounproject.com/png/3534960-200.png" alt="Budget Icon" />
                        <h3>See Your Stocks in One Place</h3>
                        <p>Keep track of your stock portfolio with real-time data and analytics.</p>
                    </div>
                    <div className="item">
                        <img src="https://static.thenounproject.com/png/6057815-200.png" alt="Budget Icon" />
                        <h3>Manage Your Services</h3>
                        <p>Easily manage and categorize your service expenses to stay on top of your finances.</p>
                    </div>
                    <div className="item">
                        <img src="https://static.thenounproject.com/png/4317482-200.png" alt="Budget Icon" />
                        <h3>Plan Your Budget</h3>
                        <p>Create and monitor budgets to ensure you're on track with your financial goals.</p>
                    </div>
                    <div className="item">
                        <img src="https://static.thenounproject.com/png/6883784-200.png" alt="Budget Icon" />
                        <h3>Track Your Expenses</h3>
                        <p>Keep a detailed record of all your expenses to better manage your finances.</p>
                    </div>
                    <div className="item">
                        <img src="https://static.thenounproject.com/png/6770678-200.png" alt="Budget Icon" />
                        <h3>Analyze Your Investments</h3>
                        <p>Get insights and analytics on your investment performance to make informed decisions.</p>
                    </div>
                </div>
            </section>

            <section className="user-reviews mt-5 mb-5">
                <h2 className="text-center downTittle pt-5"><strong>What Our Users Say</strong></h2>
                <div id="carouselExampleRide" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-inner">
                        {testimonials.map((testimonial, index) => (
                            <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                                <div className="d-flex flex-column justify-content-center align-items-center p-4">
                                    <p className="text-center downText">"{testimonial.text}"</p>
                                    <h5 className="mt-3 text-center yellow pb-5">- {testimonial.author}</h5>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};
