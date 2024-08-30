import React, { useState, useEffect, useContext } from 'react';  // Importa React, useState, useEffect y useContext
import { Context } from '../store/appContext';  // Importa el contexto de la aplicación
import "../../styles/login.css";  // Importa el archivo CSS para estilos personalizados

function Login() {
    const { actions } = useContext(Context);  // Obtiene las acciones del contexto
    const [email, setEmail] = useState('');  // Estado para almacenar el correo electrónico
    const [password, setPassword] = useState('');  // Estado para almacenar la contraseña
    const [showPassword, setShowPassword] = useState(false);  // Estado para controlar la visibilidad de la contraseña
    const [error, setError] = useState('');  // Estado para almacenar mensajes de error

    useEffect(() => {
        // Agrega una clase al body si la ruta actual es '/login'
        if (window.location.pathname === '/login') {
            document.body.classList.add('login-page');
        }
        return () => {
            // Limpia la clase cuando el componente se desmonte o cambie la ruta
            document.body.classList.remove('login-page');
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();  // Previene el comportamiento por defecto del formulario
        setError("");  // Limpia cualquier error previo

        try {
            const response = await actions.loginUser(email, password);  // Llama a la acción para iniciar sesión
            if (response.success) {
                // Almacena el token en localStorage y redirige al usuario
                localStorage.setItem('access_token', response.access_token);
                window.location.href = '/';  // Redirige a la página principal
            } else {
                setError(response.message || "Error al iniciar sesión.");  // Muestra el mensaje de error si ocurre un problema
            }
        } catch (err) {
            console.error("Error al iniciar sesión", err);
            setError("Hubo un error al iniciar sesión.");  // Muestra un mensaje de error genérico en caso de excepción
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
                    onChange={(e) => setEmail(e.target.value)}  // Actualiza el estado de email
                    required
                />

                <div className="password-wrapper">
                    <input
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  // Actualiza el estado de password
                        required
                    />
                    <button
                        type="button"
                        className="toggle-password btn btn-outline-light"
                        onClick={() => setShowPassword(!showPassword)}  // Alterna la visibilidad de la contraseña
                    >
                        <i className="fa-solid fa-eye"></i> 
                        
                    </button>
                </div>

                <button className='submit btn btn-primary' type="submit">Login</button>
                {error && <p className='error'>{error}</p>}  {/* Muestra el mensaje de error si existe */}
                <p className='forgot'>Forgot your password? <a href="/recovery-password">Recover it here</a></p>
            </form>
        </div>
    );
}

export default Login;
