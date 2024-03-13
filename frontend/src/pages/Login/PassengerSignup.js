/* Part of this file was leveraged from GPT */ 
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PassengerSignup.scss';
import { API_BASE_URL } from '../../services/api';
import SignupForm from '../../components/SignupForm/SignupForm.js';
import GoogleSignup from '../../components/GoogleSignup/GoogleSignup.js'; 
import useSignup from '../../hooks/useSignup';

const PassengerSignup = () => {
    const navigate = useNavigate();
    const handleGoogleSuccess = (googleData) => {
        console.log('Google signup successful:', googleData);
        if(googleData.token) {
            window.localStorage.setItem('AuthToken', `Bearer ${googleData.token}`);
            navigate('/home'); 
        }
    };

    const handleGoogleFailure = (error) => {
        console.error('Google signup failed:', error);
    };

    const { handleSubmit, errors } = useSignup('Passenger', `${API_BASE_URL}/passenger/register`, '/passenger-login');

    return (
        <div className="passenger-signup-page">
            <div className="top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <h2>Passenger Signup</h2>
                    <SignupForm onSubmit={handleSubmit} errors={errors} userRole="Passenger" />
                    <div className="social-signup">
                        <GoogleSignup onSuccess={handleGoogleSuccess} onFailure={handleGoogleFailure} accountType={"passenger"} />
                    </div>
                    <p className="login-link">Already have an account? <Link to="/passenger-login">Login here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default PassengerSignup;
