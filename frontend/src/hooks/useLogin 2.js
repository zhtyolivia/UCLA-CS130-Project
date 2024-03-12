import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../services/api';

const useLogin = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const login = async (email, password, accountType) => {
        try {
            const body = {
                email,
                password,
            };

            let endpoint = `${API_BASE_URL}/`;
            // Determine the endpoint based on the accountType
            switch (accountType) {
                case 'passenger':
                    endpoint += 'passenger/signin';
                    break;
                case 'driver':
                    endpoint += 'driver/signin';
                    break;
                default:
                    throw new Error('Invalid account type');
            }

            const response = await axios.post(endpoint, body);

            if (response.data.status === 'Success') {
                window.localStorage.setItem('AuthToken', `Bearer ${response.data.token}`);
                window.location.reload();
                navigate('/home');
            } else if (response.data.status === 'FAILED') {
                const errorText = response.data.message;
                handleErrors(errorText);
            }
        } catch (error) {
            console.error('Error when logging in: ', error);
            // Adjust error handling as necessary, possibly setting a generic error
            setErrors({ generic: 'An error occurred during login. Please try again.' });
        }
    };

    const handleErrors = (errorText) => {
        if (errorText === "No existing User with input email") {
            setErrors({ email: errorText });
        } else if (errorText === "Wrong password") {
            setErrors({ password: errorText });
        }
        // Handle other types of errors (e.g., invalid account type) if needed
    };

    return { login, errors };
};

export default useLogin;
