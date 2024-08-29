import React, { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./component/protectedRoute";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import Register from "./pages/register";
import Login from "./pages/login";
import RecoveryPassword from "./pages/recoveryPassword";
import ResetPassword from "./pages/resetPassword";
import { ContactUs } from "./pages/contact";

import { Home } from "./pages/home";
import Dashboard from "./pages/dashboard";
import CryptoApp from "./pages/crypto";
import StockApp from "./pages/stocks";
import CategoryManager from "./pages/servicios";

import Navbar from "./component/navbar";
import { Footer } from "./component/footer";

import injectContext, { Context } from "./store/appContext";


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
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/recovery-password" element={<RecoveryPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword/>} />
                        <Route path="/contact" element={<ContactUs />} />
                        
                        <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
                        <Route path="/crypto" element={<ProtectedRoute component={CryptoApp} />} />
                        <Route path="/stocks" element={<ProtectedRoute component={StockApp} />} />
                        <Route path="/servicios" element={<ProtectedRoute component={CategoryManager} />} />
                
                        <Route path="*" element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
