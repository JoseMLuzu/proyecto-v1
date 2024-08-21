// RecoveryPassword.js (React)
import React, { useState } from 'react';

const RecoveryPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lógica para enviar el email al backend
        const response = await fetch('/api/recover-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (response.ok) {
            alert('Se ha enviado un enlace de recuperación a tu correo.');
        } else {
            alert('No se pudo procesar la solicitud.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Email:
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Recuperar contraseña</button>
        </form>
    );
};

export default RecoveryPassword;
