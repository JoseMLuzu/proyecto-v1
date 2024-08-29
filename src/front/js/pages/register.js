import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext'; // Asegúrate de que la ruta sea correcta
import "../../styles/register.css";

function Register() {
    const { actions } = useContext(Context);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña

    useEffect(() => {
        if (window.location.pathname === '/register') {
            document.body.classList.add('register-page');
        }
        return () => {
            document.body.classList.remove('register-page');
        };
    }, []);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }

        setError(""); // Limpiar errores previos

        try {
            const response = await actions.registerUser(username, email, password, confirmPassword); // Pasa confirmPassword
            if (response.success) {
                window.location.href = '/login';
            } else {
                setError(response.message || "Error registering user.");
            }
        } catch (err) {
            console.error("Error registering user", err);
            setError("There was an error registering the user.");
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center min-vh-100">
            <form className="register-form" onSubmit={handleSubmit}>
                <span className='span1'></span>
                <span className='span2'></span>
                <span className='span3'></span>
                <span className='span4'></span>
                <span className='span5'></span>
                <span className='span6'></span>
                <span className='span7'></span>

                <h1>Sign Up</h1>
                <input className='mb-3'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input className=''
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <div className="password-field">
                    <input className=''
                        type={showPassword ? "text" : "password"}  // Cambia el tipo entre 'text' y 'password'
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="toggle-password-btn"
                    >
                        {showPassword ? "" : ""}
                    </button>
                </div>
                <div className="password-field">
                    <input className=''
                        type={showPassword ? "text" : "password"}  // Cambia el tipo entre 'text' y 'password'
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="toggle-password-btn"
                    >
                        <i className="fa-solid fa-eye"></i> 
                        {showPassword ? "" : ""}
                    </button>
                </div>
                <button className='p submit' type="submit">Sign Up</button>
                {error && <p className='error'>{error}</p>}
                <p className='forgot'>Already have an account? <a href="/login">Log in</a></p>
            </form>
        </div>
    );
}

export default Register;
