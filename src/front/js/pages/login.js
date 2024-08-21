import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import "../../styles/login.css";

function Login() {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
    const [error, setError] = useState('');

    useEffect(() => {
        if (window.location.pathname === '/login') {
            document.body.classList.add('login-page');
        }
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await actions.loginUser(email, password);
            if (response.success) {
                // Almacenar el token en localStorage
                localStorage.setItem('access_token', response.access_token);
                window.location.href = '/';
            } else {
                setError(response.message || "Error al iniciar sesión.");
            }
        } catch (err) {
            console.error("Error al iniciar sesión", err);
            setError("Hubo un error al iniciar sesión.");
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <form className="login-form" onSubmit={handleSubmit}>
                <span className='span1'></span>
                <span className='span2'></span>
                <span className='span3'></span>
                <span className='span4'></span>
                <span className='span5'></span>
                <span className='span6'></span>
                <span className='span7'></span>

                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"}  // Cambia el tipo de entrada basado en el estado
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password btn btn-outline-light"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        <i className="fa-solid fa-eye"></i> 
                        {showPassword ? "" : ""}
                    </button>
                </div>

                <button className='submit btn btn-primary' type="submit">Iniciar sesión</button>
                {error && <p className='error'>{error}</p>}
                <p className='forgot'>¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala aquí</a></p>
            </form>
        </div>
    );
}

export default Login;
