import React, { useState } from 'react';  // Importa React y useState para manejar el estado del componente
import '../../styles/recoveryPassword.css';  // Importa el archivo CSS para estilos personalizados

const RecoveryPassword = () => {
  const [email, setEmail] = useState('');  // Estado para almacenar el email del usuario
  const [message, setMessage] = useState('');  // Estado para almacenar mensajes de éxito
  const [error, setError] = useState('');  // Estado para almacenar mensajes de error

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();  // Evita el comportamiento por defecto del formulario (recarga de página)

    try {
      // Realiza una solicitud POST para enviar el email de recuperación
      const response = await fetch('https://zany-cod-977rxw469x7qfx4qw-3001.app.github.dev/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),  // Envía el email en el cuerpo de la solicitud
      });

      // Verifica si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('Error en la solicitud');  // Lanza un error si la respuesta no es OK
      }

      const result = await response.json();  // Analiza la respuesta JSON
      setMessage(result.message);  // Establece el mensaje de éxito
      setError('');  // Limpia el mensaje de error
    } catch (err) {
      setError('Hubo un problema al enviar el correo de recuperación.');  // Establece el mensaje de error
      setMessage('');  // Limpia el mensaje de éxito
    }
  };

  return (
    <div className="containerP">
      <div className="form-container">
        <h1 className="P mb-5">Recover Password</h1>  
        <form onSubmit={handleSubmit}>  {/* Manejador de envío del formulario */}
          <div className="mb-3">
            <input
              type="email"
              className="emailA"
              placeholder='Email Address'
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Actualiza el estado del email cuando cambia
              required
            />
            <div id="emailHelp" className="form-text mt-3">We will never share your email with anyone else.</div>  
          </div>
          <button type="submit" className="submit-button">Send</button>  
        </form>
        {message && <p className="text-success mt-3">{message}</p>}  
        {error && <p className="text-danger mt-3">{error}</p>}  
      </div>
      {/* Estrellas decorativas */}
      <span className="star span1"></span>
      <span className="star span2"></span>
      <span className="star span3"></span>
      <span className="star span4"></span>
      <span className="star span5"></span>
      <span className="star span6"></span>
      <span className="star span7"></span>
    </div>
  );
};

export default RecoveryPassword;
