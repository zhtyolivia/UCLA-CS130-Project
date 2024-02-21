import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Signup.css'; // Assuming you have a separate CSS file for the signup page
import axios from 'axios'; // Ensure axios is installed

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [accountType, setAccountType] = useState(''); // Added state for account type
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!accountType) {
            alert('Please select an account type');
            return;
        }
        try {
            const response = await axios.post('/api/signup', { email, password, accountType });
            console.log(response.data); // Example response handling
            navigate.push('/login'); // Redirect to login page after successful signup
        } catch (error) {
            navigate.error(error); // Handle error
        }
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
                        <div className="input-group">
                            <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <p className="Already have an account">Already have an account? <Link to="/login" className="login">Login</Link></p>
                        <button type="submit" className="signup-btn">Signup</button>
                        <div className="divider">Or</div>
                        <button className="social-btn google">Login with Google</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
