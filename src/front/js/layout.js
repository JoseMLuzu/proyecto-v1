import React, { useEffect, useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import CryptoApp from "./pages/crypto";
import Stocks from "./pages/stocks";
import Profile from "./pages/profile";
import RecoveryPassword from "./pages/recoveryPassword";
import { ContactUs } from "./pages/contact";
import { Single } from "./pages/single";
import injectContext, { Context } from "./store/appContext";
import Navbar from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    const { actions } = useContext(Context);


    // Asegúrate de que BACKEND_URL esté disponible
    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    const basename = process.env.BASENAME || "";

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Register />} path="/register" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Dashboard />} path="/dashboard" />
                        <Route element={<CryptoApp />} path="/crypto" />
                        <Route element={<Stocks />} path="/stocks" />
                        <Route element={<Profile />} path="/profile" />
                        <Route element={<ContactUs />} path="/contact" />
                        <Route element={<RecoveryPassword />} path="/recovery-password" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
