import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the App component
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="507764879519-bq2m0tlancl6nkn9gosqvhuk34qd3vdt.apps.googleusercontent.com">
      <App /> {/* Use App component which contains the Routes */}
    </GoogleOAuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
