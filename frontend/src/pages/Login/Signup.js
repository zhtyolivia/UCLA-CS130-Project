import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Signup.scss'; // Assuming you have a separate CSS file for the signup page
import axios from 'axios'; // Ensure axios is installed
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';


const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState(''); // Added state for account type
    const [passwordShown, setPasswordShown] = useState(false); 
    const navigate = useNavigate();

    const isValidEmail = email => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);


    const handleSignup = async (e) => {
        e.preventDefault();
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!accountType) {
            alert('Please select an account type');
            return;
        }

        const endpoint = accountType === 'driver' ? '/driver/register' : '/passenger/register';
        const url = `http://localhost:3001${endpoint}`;
        const userData = {
            email,
            password,
            accountType
            // Include other data needed by your backend for registration
        };

        try {
            const response = await axios.post(url, userData);
            console.log(response.data);
            navigate('/login'); // Redirect to login page on success
        } catch (error) {
            console.error('Signup failed:', error.response?.data || error.message);
            alert(error.response?.data.error || 'Signup failed, please try again.');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };
    

    return (
        <div className="signup-page">
            <div className="top-stripe">
                <span className="brand-text">SwiftLink</span>
            </div>
            <div className="signup-container">
                <div className="signup-card">
                    <Link to="/login" className="back-btn">
                        <FontAwesomeIcon icon="arrow-left" /> Back
                    </Link>
                    <h2>Signup</h2>
                    <form className="signup-form" onSubmit={handleSignup}>
                        {/* Account Type Selection */}
                         <div className="account-type-selection">
                            <button type="button" className={`account-type-btn ${accountType === 'passenger' ? 'selected' : ''}`} onClick={() => setAccountType('passenger')}>Passenger</button>
                            <button type="button" className={`account-type-btn ${accountType === 'driver' ? 'selected' : ''}`} onClick={() => setAccountType('driver')}>Driver</button>
                        </div>
                        <div className="input-group">
                            <input type="email" placeholder="Email" required onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="input-group password-group">
                            <input type={passwordShown ? "text" : "password"} placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                                <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <p className="Already have an account">Already have an account? <Link to="/login" className="login">Login</Link></p>
                        <button type="submit" className="signup-btn">Signup</button>
                        <div className="divider">Or</div>
                        <div className="social-login">
                        <button type="button" className="social-btn google">
                            <FontAwesomeIcon icon={faGoogle} /> Sign up using Google
                        </button>
                        </div>                    
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
