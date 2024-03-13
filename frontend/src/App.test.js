//part of this file is leveraged from GPT/Copilot
import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot for React 18
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import App from './App';
import DriverSignup from './pages/Login/DriverSignup';
import DriverHome from './pages/Driver/Home/DriverHome';
import DriverProfile from './pages/Driver/Profile/DriverProfile';
import DriverPostDetail from './pages/Driver/Home/DriverPostDetail';
import PassengerPostDetail from './pages/Driver/Home/PassengerPostDetail';
import { GoogleOAuthProvider } from '@react-oauth/google'; // Import the GoogleOAuthProvider
const mockClientId = 'your-google-oauth-client-id';


jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    defaults: {
        headers: {
          get common() {
            return {}; // This ensures a fresh object for each access
          },
        },
    },
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'), // Use actual for all non-overridden methods
    useNavigate: () => jest.fn(), // Mock useNavigate
    useParams: () => ({ postId: '123' }), // Mock useParams for your specific use case
}));

// Basic App Component Test
it('renders App component without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div); // Use createRoot for React 18
  root.render(<App />);
});

// Driver Components Tests
it('renders DriverSignup component without crashing', () => {
    const div = document.createElement('div');
    const root = createRoot(div);
    root.render(
      <BrowserRouter>
        <DriverSignup />
      </BrowserRouter>
    );
  });

it('renders DriverHome component without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <BrowserRouter>
      <DriverHome />
    </BrowserRouter>
  );
});

it('renders DriverProfile component without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <BrowserRouter>
      <DriverProfile />
    </BrowserRouter>
  );
});


it('renders DriverPostDetail component with mock post ID without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <BrowserRouter>
      <DriverPostDetail />
    </BrowserRouter>
  );
});

it('renders PassengerPostDetail component with mock post ID without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);
  root.render(
    <BrowserRouter>
      <PassengerPostDetail />
    </BrowserRouter>
  );
});

it('renders expected text content in DriverSignup', async () => {
    render(
      <GoogleOAuthProvider clientId={mockClientId}> 
        <BrowserRouter>
          <DriverSignup />
        </BrowserRouter>
      </GoogleOAuthProvider>
    );
    expect(await screen.findByText('Signup as Driver')).toBeInTheDocument();
  });