import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Context } from '../store/appContext';
import '../../styles/navbar.css';

const Navbar = () => {
    const { store, actions } = useContext(Context);
    const [isLoggedIn, setIsLoggedIn] = useState(!!store.token);
    const location = useLocation();

    useEffect(() => {
        setIsLoggedIn(!!store.token);
    }, [store.token]);

    const handleLogout = () => {
        actions.logoutUser();
        setIsLoggedIn(false);
    };

    const isDashboard = location.pathname === '/dashboard';

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
            <div className="container">

                <Link to="/">
                    <button className="btn btn-outline-light my-3 navregister">Home</button>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <div className="navbar-nav me-auto">
                        {isLoggedIn && (
                            <>
                                <Link to="/dashboard">
                                    <button className="btn btn-outline-light my-3 navlogin ms-5">Dashboard</button>
                                </Link>
                                <Link to="/crypto">
                                    <button className="btn btn-outline-light my-3 navlogin">Crypto</button>
                                </Link>
                                <Link to="/stocks">
                                    <button className="btn btn-outline-light my-3 navlogin">Stocks</button>
                                </Link>

                                {isDashboard && (
                                    <>
                                        <a href="#text1">
                                            <button className="btn my-3 navlogin">Financial News</button>
                                        </a>
                                        <a href="#text2">
                                            <button className="btn my-3 navlogin">Crypto News</button>
                                        </a>
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    <div className="navbar-nav ms-auto">
                        {isLoggedIn ? (
                            <>
                                <button className="btn btn-outline-light navregister" onClick={handleLogout}>Log out</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="btn btn-dark my-3 me-2 navlogin">Login</button>
                                </Link>
                                <Link to="/register">
                                    <button className="btn btn-outline-light my-3 navregister">Register</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
