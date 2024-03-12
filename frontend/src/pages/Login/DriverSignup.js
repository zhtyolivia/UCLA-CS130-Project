import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DriverSignup.scss';
import { API_BASE_URL } from '../../services/api';
import SignupForm from '../../components/SignupForm/SignupForm.js';
import GoogleSignup from '../../components/GoogleSignup/GoogleSignup.js'; // Make sure this path is correct
import useSignup from '../../hooks/useSignup';


const DriverSignup = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleGoogleSuccess = (googleData) => {
        console.log('Google signup successful:', googleData);
    };
    const handleGoogleFailure = (error) => {
        console.error('Google signup failed:', error);
    };

    const { handleSubmit, error } = useSignup('Driver', `${API_BASE_URL}/driver/register`, '/driver-login');

    return (
        <div className="driver-signup-page">
            <div className="top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <h2>Driver Signup</h2>
                    <SignupForm onSubmit={handleSubmit} errors={errors} userRole="Driver" />
                    <div className="social-signup">
                        <GoogleSignup onSuccess={handleGoogleSuccess} onFailure={handleGoogleFailure} accountType="driver"/>
                    </div>
                    <p className="login-link">Already have an account? <Link to="/driver-login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default DriverSignup;

