import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';  // Asegúrate de que la ruta sea correcta
import "../../styles/register.css";

function Register() {
    const { actions } = useContext(Context);  // Obtiene las acciones del contexto
    const [username, setUsername] = useState('');  // Estado para el nombre de usuario
    const [email, setEmail] = useState('');  // Estado para el correo electrónico
    const [password, setPassword] = useState('');  // Estado para la contraseña
    const [confirmPassword, setConfirmPassword] = useState('');  // Estado para la confirmación de la contraseña
    const [error, setError] = useState('');  // Estado para mensajes de error
    const [showPassword, setShowPassword] = useState(false);  // Estado para controlar la visibilidad de la contraseña

    useEffect(() => {
        // Añade una clase al body cuando se monta el componente
        if (window.location.pathname === '/register') {
            document.body.classList.add('register-page');
        }
        return () => {
            // Elimina la clase cuando el componente se desmonte o cambie la ruta
            document.body.classList.remove('register-page');
        };
    }, []);

    const togglePasswordVisibility = () => {
        // Alterna la visibilidad de la contraseña
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();  // Previene el comportamiento por defecto del formulario

        if (password !== confirmPassword) {
            setError("Passwords don't match.");  // Muestra un mensaje si las contraseñas no coinciden
            return;
        }

        setError("");  // Limpia errores previos

        try {
            // Intenta registrar al usuario con la acción del contexto
            const response = await actions.registerUser(username, email, password);
            if (response.success) {
                // Redirige al usuario a la página de login si el registro es exitoso
                window.location.href = '/login';
            } else {
                setError(response.message || "Error registering user.");  // Muestra el mensaje de error del servidor
            }
        } catch (err) {
            console.error("Error registering user", err);
            setError("There was an error registering the user.");  // Muestra un mensaje de error genérico en caso de excepción
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
                <input
                    className='mb-3'
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}  // Actualiza el estado de username
                    required
                />
                <input
                    className='mb-3'
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Actualiza el estado de email
                    required
                />
                <div className="password-field">
                    <input
                        className=''
                        type={showPassword ? "text" : "password"}  // Alterna entre texto y contraseña
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}  // Actualiza el estado de password
                        required
                    />
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="toggle-password-btn"
                    >
                        <i className="fa-solid fa-eye"></i> 
                        
                    </button>
                </div>
                <div className="password-field">
                    <input
                        className=''
                        type={showPassword ? "text" : "password"}  // Alterna entre texto y contraseña
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}  // Actualiza el estado de confirmPassword
                        required
                    />
                    <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="toggle-password-btn"
                    >
                        <i className="fa-solid fa-eye"></i> 
                        
                    </button>
                </div>
                <button className='p submit' type="submit">Sign Up</button>
                {error && <p className='error'>{error}</p>}  {/* Muestra el mensaje de error si existe */}
                <p className='forgot pb-3'>Already have an account? <a href="/login">Log in</a></p>
            </form>
        </div>
    );
}

export default Register;
