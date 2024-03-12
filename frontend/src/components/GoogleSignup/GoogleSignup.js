import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const GoogleSignup = ({ onSuccess, onFailure, accountType }) => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Token response from Google:", tokenResponse);
      console.log("account Type:", accountType);
      try {
        // Construct the endpoint URL based on accountType
        const endpoint = accountType === 'driver' ? '/driver/register/google' : '/passenger/register/google';
        const payload = {
          code: tokenResponse.code,
          accountType,
        };
        // Make a POST request to the appropriate endpoint
        const response = await axios.post(`http://localhost:3001${endpoint}`, payload);
        
        // If the request is successful, handle success
        if (onSuccess) onSuccess(response.data);
      } catch (error) {
        // The response from the backend is in error.response.data
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          console.log(error.response.data);
          // If the request fails, handle failure and pass the error message to onFailure
          if (onFailure) onFailure(error.response.data.message);
        } else {
          // The request was made but no response was received or an error occurred in setting up the request
          if (onFailure) onFailure(error.message);
        }
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
      Sign In/Up Using Google
    </button>
  );
};


export default GoogleSignup;
