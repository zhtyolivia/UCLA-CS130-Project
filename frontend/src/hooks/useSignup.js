// useSignup.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useSignup = (userRole, apiEndpoint, successRedirect) => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleSubmit = async (values) => {
        if (values.password !== values.confirmPassword) {
            setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
            return;
        }

        try {
            const response = await axios.post(apiEndpoint, {
                email: values.email,
                password: values.password,
                name: values.name,
                phonenumber: values.phonenumber,
            });

            if (response.data.status === 'Success') {
                navigate(successRedirect);
            } else {
                setErrors({ ...errors, form: response.data.message });
            }
        } catch (error) {
            console.error(`${userRole} Signup error:`, error);
            setErrors({ ...errors, form: 'An error occurred during signup. Please try again.' });
        }
    };

    return { handleSubmit, errors };
};
export default useSignup;