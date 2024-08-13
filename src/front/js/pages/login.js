import React, { useEffect } from 'react';
import "../../styles/login.css";

function Login() {
    useEffect(() => {
        if (window.location.pathname === '/login') {
            document.body.classList.add('login-page');
        }
        return () => {
            document.body.classList.remove('login-page');
        };
    }, []);

    return (
        <form className="login-form">
            <span className='span1'></span>
            <span className='span2'></span>
            <span className='span3'></span>
            <span className='span4'></span>
            <span className='span5'></span>
            <span className='span6'></span>
            <span className='span7'></span>

            <h1>Login</h1>
            <input type="text" placeholder="Nombre de usuario" />
            <input type="password" placeholder="Contraseña" />
            <button className='submit' type="submit">Iniciar sesion</button>
            <p className='forgot'>¿Olvidaste tu contrasena? <a href="/login">Inicia sesión</a></p>
        </form>
    );
}

export default Login;