import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './PassengerLogin.scss'; // Make sure to import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { isLoggedIn } from '../../utils/LoginActions';

import axios from "axios";
import { API_BASE_URL } from '../../services/api';


const PassengerLogin = () => {
    const navigate = useNavigate();

    // Initialize state for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Initialize state for toggling password visibility
    const [passwordShown, setPasswordShown] = useState(false);

    // Define a function to toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    useEffect(() => {
        if (isLoggedIn()) {
        navigate("/home");
        }
    }, [navigate]);

    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
    });

    const [errors, setErrors] = useState({});

    const handleChange = prop => event => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
        
    const handleSubmit = (event) => {
        console.log(values)
        event.preventDefault();
        console.log('Form submitted');
        loginAction(values);
        
    };

    const loginAction = async (values) => {
        try {
          const body = {
              email: values.email,
              password: values.password,
          };
          const res = await axios.post(`${API_BASE_URL}/passenger/signin`, body);
          console.log(res.data.status)

          if (res.data.status === 'Success') {
            window.localStorage.setItem('AuthToken', `Bearer ${res.data.token}`);
            // window.localStorage.setItem('AuthToken', `${res.data.token}`);
            window.location.reload();
            navigate('/home');
          } else if (res.data.status === 'FAILED') {
            const errorText = res.data.message;
            if (errorText === "No existing User with input email"){ 
                setErrors({ ...errors, email: errorText });
            } 
            else if (errorText === "Wrong password") {
                setErrors({ ...errors, password: errorText });
            }
          }
        } catch (err) {
            console.error('Error when logging in: ',err)
        }
    }
    
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
                    <h2>PassengerLogin</h2>
                    <form className="p-login-form" onSubmit={handleSubmit}>
                        <div className="p-input-group">
                            <input type="text" placeholder="Username" required onChange={handleChange("email")} />
                            {errors.email && <p className="p-login-error">{errors.email}</p>} {/* Display error message for email */}
                        </div>
                        <div className="p-input-group">
                            <div className="p-password-action-container">
                                <input type={passwordShown ? "text" : "password"} placeholder="Password" required onChange={handleChange("password")} />
                                <button type="button" className="p-toggle-password" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={passwordShown ? faEyeSlash : faEye} />
                                </button>
                            </div>
                        </div>
                        <div className='p-password-error'>
                            {errors.password && <p className="p-login-error">{errors.password}</p>} {/* Display error message below input and button */}
                        </div>
                        <button type="submit" className="p-login-btn">Login</button>
                    </form>
                    <p className="p-sign-up-text">Don't have an account? <Link to="/passenger-signup" className="sign-up">Sign up</Link></p>
                    <div className="p-social-login">
                        <button type="button" className="p-social-btn google">
                            <FontAwesomeIcon icon={faGoogle} /> Sign up using Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerLogin;
