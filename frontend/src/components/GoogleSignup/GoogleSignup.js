//Part of this file was leveraged from GPT
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
        const endpoint = accountType === 'driver' ? '/driver/register/google' : '/passenger/register/google';
        const payload = {
          code: tokenResponse.code,
          accountType,
        };
        const response = await axios.post(`https://cs130-swift-link-f88aab47b45c.herokuapp.com${endpoint}`, payload);
        
        if (onSuccess) onSuccess(response.data);
      } catch (error) {
        // The response from the backend is in error.response.data
        if (error.response) {
          console.log(error.response.data);
          // If the request fails, handle failure and pass the error message to onFailure
          if (onFailure) onFailure(error.response.data.message);
        } else {
          // no response was received or an error occurred in setting up the request
          if (onFailure) onFailure(error.message);
        }
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      if (onFailure) onFailure(error);
    },
    flow: 'auth-code', 
  });

  return (
    <button onClick={() => googleLogin()} className="social-btn google">
      Sign In/Up Using Google
    </button>
  );
};


export default GoogleSignup;
