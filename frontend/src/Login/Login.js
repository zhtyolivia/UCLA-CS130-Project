import React, { useState } from 'react';
import './Login.css'; // Make sure to import the CSS file
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // Ensure you have axios installed for HTTP requests


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordShown, setPasswordShown] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { username, password });
            // Assuming the response includes the account type
            const accountType = response.data.accountType; // Make sure to adjust this based on your actual API response
            console.log(response.data);
            if (accountType === 'driver') {
                navigate.push('/driverHomePage'); // Redirect to driver's home page
            } else {
                navigate.push('/passengerHomePage'); // Redirect to passenger's home page
            }
        } catch (error) {
            console.error(error);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="login-page">
            <div className="top-stripe">
                <span className="brand-text">SwiftLink</span> 
            </div>
            <div className="login-container">
                <div className="login-card">
                    <Link to="/" className="back-btn">
                        <FontAwesomeIcon icon="arrow-left" /> Back
                    </Link>
                    <h2>Login</h2>
                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="input-group">
                            <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="input-group">
                            <input type={passwordShown ? "text" : "password"} placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <button type="submit" className="login-btn">Login</button>
                        <p className="forgot-password">Forgot password?</p>
                    </form>
                    <p className="sign-up-text">Don't have an account? <Link to="/signup" className="sign-up">Sign up</Link></p>
                    <div className="social-login">
                        <button type="button" className="social-btn google">
                            <FontAwesomeIcon icon={faGoogle} /> Sign up using Google
                        </button>
                    </div>
                    <Link to="/home">Go to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
