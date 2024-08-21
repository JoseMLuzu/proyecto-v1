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

    useEffect(() => {
        if (window.location.pathname === '/register') {
            document.body.classList.add('register-page');
        }
        return () => {
            document.body.classList.remove('register-page');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setError(""); // Limpiar errores previos

        try {
            const response = await actions.registerUser(username, email, password, confirmPassword); // Pasa confirmPassword
            if (response.success) {
                window.location.href = '/login';
            } else {
                setError(response.message || "Error al registrar el usuario.");
            }
        } catch (err) {
            console.error("Error al registrar el usuario", err);
            setError("Hubo un error al registrar el usuario.");
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

            <h1>Registro</h1>
            <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
            <button className='submit' type="submit">Registrarse</button>
            {error && <p className='error'>{error}</p>}
            <p className='forgot'>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
        </form>
    </div>
    );
}

export default Register;
