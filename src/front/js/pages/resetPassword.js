import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../styles/resetPassword.css';

const ResetPassword = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords don't match.");
            return;
        }

        try {
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

            const data = await response.json();
            if (data.success) {
                setMessage('Your password has been successfully reset.');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            console.error(error);
            setMessage('There was an error resetting your password.');
        }
    };

    return (
        <div className="containerP2">
            <div className="form-container">
                <h1 className='mb-5'>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='New Password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder='Confirm Password'
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
                        </button>
                    </div>
                    <button className='mt-3' type="submit">Reset Password</button>
                </form>
                {message && <p>{message}</p>}
            </div>
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
