import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DriverLogin.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { API_BASE_URL } from '../../services/api';
import { isLoggedIn } from '../../utils/LoginActions';
import useLogin from '../../hooks/useLogin'; // Ensure this path matches where you save the hook


const DriverLogin = () => {
    const navigate = useNavigate();
    const { login, errors } = useLogin('driver'); // Assuming your useLogin hook can accept 'driver' as an argument for accountType
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

    useEffect(() => {
        // Assuming isLoggedIn checks auth token validity and determines if it's a driver's token
        if (isLoggedIn()) {
            navigate("/driver-home");
        }
    }, [navigate]);

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email, password, 'driver'); // Now, explicitly passing 'driver' as the accountType
    };

    return (
        <div className="login-page">
            <div className="log-in-top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="login-container">
                <div className="login-card">
                    <Link to="/" className="back-btn">Back</Link>
                    <h2>Driver Login</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <input type="email" placeholder="Email" value={email} required onChange={handleEmailChange} />
                            {errors.email && <div className="error-text">{errors.email}</div>}
                        </div>
                        <div className="input-group password-group">
                            <input type={passwordShown ? "text" : "password"} placeholder="Password" value={password} required onChange={handlePasswordChange} />
                            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                            </button>
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    <p className="sign-up-text">
                        Don't have an account? <Link to="/driver-signup">Sign up</Link>
                    </p>
                    <div className="social-login">
                        <button type="button" className="social-btn google">
                            <FontAwesomeIcon icon={faGoogle} /> Sign up using Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverLogin;