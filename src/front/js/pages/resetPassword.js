import React, { useState } from 'react';  // Importa React y useState para manejar el estado del componente
import { useParams, useNavigate } from 'react-router-dom';  // Importa useParams para obtener parámetros de la URL y useNavigate para redirigir
import '../../styles/resetPassword.css';  // Importa el archivo CSS para estilos personalizados

const ResetPassword = () => {
    const { token } = useParams();  // Obtiene el token de recuperación de la URL
    const [newPassword, setNewPassword] = useState('');  // Estado para almacenar la nueva contraseña
    const [confirmPassword, setConfirmPassword] = useState('');  // Estado para almacenar la confirmación de la nueva contraseña
    const [message, setMessage] = useState('');  // Estado para almacenar mensajes de éxito o error
    const [showPassword, setShowPassword] = useState(false);  // Estado para controlar la visibilidad de la contraseña
    const navigate = useNavigate();  // Hook para redirigir a otras rutas

    // Alterna la visibilidad de las contraseñas
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Maneja el envío del formulario
    const handleSubmit = async (event) => {
        event.preventDefault();  // Evita el comportamiento por defecto del formulario (recarga de página)

        // Verifica si las contraseñas coinciden
        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match.");  // Muestra un mensaje si las contraseñas no coinciden
            return;
        }

        try {
            // Realiza una solicitud POST para restablecer la contraseña
            const response = await fetch('https://zany-cod-977rxw469x7qfx4qw-3001.app.github.dev/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,  // Incluye el token en el cuerpo de la solicitud
                    new_password: newPassword,
                }),
            });

            const data = await response.json();  // Analiza la respuesta JSON
            if (data.success) {
                setMessage('Your password has been successfully reset.');  // Mensaje de éxito si la contraseña se restablece correctamente
                setTimeout(() => {
                    navigate('/login');  // Redirige al usuario a la página de inicio de sesión después de 2 segundos
                }, 2000);
            } else {
                setMessage(data.message);  // Muestra el mensaje de error recibido de la API
            }
        } catch (error) {
            console.error(error);  // Muestra errores en la consola
            setMessage('There was an error resetting your password.');  // Mensaje de error si ocurre un problema al realizar la solicitud
        }
    };

    return (
        <div className="containerP2">
            <div className="form-container">
                <h1 className='mb-5'>Reset Password</h1>  
                <form onSubmit={handleSubmit}> 
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}  // Muestra la contraseña en texto plano si showPassword es true
                            placeholder='New Password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}  // Actualiza el estado del nuevo password cuando cambia
                            required
                        />
                    </div>
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}  // Muestra la contraseña en texto plano si showPassword es true
                            placeholder='Confirm Password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}  // Actualiza el estado de confirmPassword cuando cambia
                            required
                        />
                        <button 
                            type="button" 
                            onClick={togglePasswordVisibility}  // Alterna la visibilidad de las contraseñas
                            className="toggle-password-btn"
                        >
                            <i className="fa-solid fa-eye"></i>  
                        </button>
                    </div>
                    <button className='mt-3' type="submit">Reset Password</button>  
                </form>
                {message && <p>{message}</p>}  {/* Muestra el mensaje si está presente */}
            </div>
            {/* Estrellas decorativas */}
            <div className="star span1"></div>
            <div className="star span2"></div>
            <div className="star span3"></div>
            <div className="star span4"></div>
            <div className="star span5"></div>
            <div className="star span6"></div>
            <div className="star span7"></div>
        </div>
    );
};

export default ResetPassword;
