import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const GoogleSignup = ({ onSuccess, onFailure, accountType }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Construct the endpoint URL based on accountType
        const endpoint = accountType === 'driver' ? '/driver/register' : '/passenger/register';

        // Make a POST request to the appropriate endpoint
        const response = await axios.post(`http://localhost:3001${endpoint}`, {
            token: tokenResponse.access_token,
        });
        

        // If the request is successful, handle success (e.g., navigate to a dashboard or show a success message)
        if (onSuccess) onSuccess(response.data);
        console.log("Sign up success");
      } catch (error) {
        console.error('Error during login with Google:', error);
        // If the request fails, handle failure (e.g., show an error message)
        if (onFailure) onFailure(error);
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      if (onFailure) onFailure(error);
    },
    flow: 'auth-code', // Make sure this matches your frontend setup
  });

  return (
    <button onClick={() => googleLogin()} className="social-btn google">
      <FontAwesomeIcon icon={faGoogle} /> Sign up using Google
    </button>
  );
};

export default GoogleSignup;
