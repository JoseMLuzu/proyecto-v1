import React, { useState } from 'react';
import '../../styles/recoveryPassword.css';

const RecoveryPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://zany-cod-977rxw469x7qfx4qw-3001.app.github.dev/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }

      const result = await response.json();
      setMessage(result.message);
      setError('');
    } catch (err) {
      setError('Hubo un problema al enviar el correo de recuperación.');
      setMessage('');
    }
  };

  return (
    <div className="containerP">
      <div className="form-container">
        <h1 className="P mb-5">Recover Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="emailA"
              placeholder='Email Address'
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div id="emailHelp" className="form-text mt-3">We will never share your email with anyone else.</div>
          </div>
          <button type="submit" className="submit-button">Send</button>
        </form>
        {message && <p className="text-success mt-3">{message}</p>}
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
      {/* Add stars here */}
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
