import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the App component

ReactDOM.render(
  <React.StrictMode>
    <App /> {/* Use App component which contains the Routes */}
  </React.StrictMode>,
  document.getElementById('root')
);
