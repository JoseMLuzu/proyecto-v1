import React, { useEffect } from 'react';
import "../../styles/register.css";

function Register() {
    useEffect(() => {
        if (window.location.pathname === '/register') {
            document.body.classList.add('register-page');
        }
        return () => {
            document.body.classList.remove('register-page');
        };
    }, []);

    return (
        <form className="register-form">
            <span className='span1'></span>
            <span className='span2'></span>
            <span className='span3'></span>
            <span className='span4'></span>
            <span className='span5'></span>
            <span className='span6'></span>
            <span className='span7'></span>

            <h1>Registro</h1>
            <input type="text" placeholder="Nombre de usuario" />
            <input type="password" placeholder="Contraseña" />
            <button className='submit' type="submit">Registrarse</button>
            <p className='forgot'>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
        </form>
    );
}

export default Register;