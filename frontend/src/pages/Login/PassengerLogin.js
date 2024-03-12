import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { isLoggedIn } from '../../utils/LoginActions';
import useLogin from '../../hooks/useLogin'; // Ensure this path matches where you save the hook
import GoogleSignup from '../../components/GoogleSignup/GoogleSignup.js'; // Make sure this path is correct

import './PassengerLogin.scss';

const PassengerLogin = () => {
    const navigate = useNavigate();
    const { login, errors } = useLogin(); // Using the custom hook
    const accountType = "passenger"; // Or "driver", depending on the context or user selection

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    // Replace handleChange with specific handlers for clarity and simplicity
    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const handleGoogleSuccess = (googleData) => {
        console.log('Google signup successful:', googleData);
        if(googleData.token) {
            window.localStorage.setItem('AuthToken', `Bearer ${googleData.token}`);
            window.location.reload();
            navigate('/home'); 
        
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google signup failed:', error);
    };
    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/home");
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email, password, accountType);
        
    };

    return (
        <div className="login-page">
            <div className="p-log-in-top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="p-login-container">
                <div className="p-login-card">
                    <Link to="/" className="p-back-btn">
                        Back
                    </Link>
                    <h2>Passenger Login</h2>
                    <form className="p-login-form" onSubmit={handleSubmit}>
                        <div className="p-input-group">
                            <input type="text" placeholder="Username" value={email} required onChange={handleEmailChange} />
                            {errors.email && <p className="p-login-error">{errors.email}</p>}
                        </div>
                        <div className="p-input-group">
                            <div className="p-password-action-container">
                                <input type={passwordShown ? "text" : "password"} placeholder="Password" value={password} required onChange={handlePasswordChange} />
                                <button type="button" className="p-toggle-password" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {errors.password && <p className="p-login-error">{errors.password}</p>}
                        </div>
                        <button type="submit" className="p-login-btn">Login</button>
                    </form>
                    <p className="p-sign-up-text">Don't have an account? <Link to="/passenger-signup" className="sign-up">Sign up</Link></p>
                    <div className="p-social-login">
                
                          <GoogleSignup onSuccess={handleGoogleSuccess} onFailure={handleGoogleFailure} accountType={"passenger"} />
                   
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerLogin;

