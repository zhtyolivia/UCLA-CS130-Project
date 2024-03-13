/* Part of this file was leveraged from GPT */ 
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DriverLogin.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { isLoggedIn } from '../../utils/LoginActions';
import useLogin from '../../hooks/useLogin'; // Ensure this path matches where you save the hook
import GoogleSignup from '../../components/GoogleSignup/GoogleSignup.js'; // Make sure this path is correct


const DriverLogin = () => {
    const navigate = useNavigate();
    const { login, errors } = useLogin('driver'); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);
    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

    useEffect(() => {
        if (isLoggedIn()) {

            navigate("/driver-home");
        }
    }, [navigate]);


    const handleGoogleSuccess = (googleData) => {
        console.log('Google signup successful:', googleData);
        if(googleData.token) {
            window.localStorage.setItem('AuthToken', `Bearer ${googleData.token}`);
            navigate('/driver-home'); 
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google signup failed:', error);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        login(email, password, 'driver'); 
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
                    <GoogleSignup onSuccess={handleGoogleSuccess} onFailure={handleGoogleFailure} accountType={"driver"} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverLogin;