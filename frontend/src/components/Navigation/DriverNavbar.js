import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './DriverNavbar.scss';
import { IconButton, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const getCurrentUserId = (token) => {
  // Decode JWT and get user ID. For now, we're just passing the token through for the example.
  return token;
};
const DriverNav = () => {
  const [userId, setUserId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user ID
    const token = localStorage.getItem('AuthToken');
    setUserId(token);
  }, []);

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearch = () => {
    navigate(`/search?query=${searchValue}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/welcome');
  };

  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <nav className="d-navbar">
      <div className="d-navbar-brand">
        <Link to="/" className="d-navbar-logo">Swift Link</Link>
      </div>
      
      <div className="d-search-bar">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchValue}
          onChange={handleSearchInputChange}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <ul className="d-navbar-nav">
        <li className="d-nav-item">
          <Tooltip title="Home">
            <IconButton onClick={() => navigate("/driver-home")}>
              <HomeIcon />
            </IconButton>
          </Tooltip>
        </li>
        
        <li className="d-nav-item">
          <Tooltip title="Initiate Ride">
            <IconButton onClick={() => navigate("/initiate-ride")}>
              <AddIcon />
            </IconButton>
          </Tooltip>
        </li>

        <li className="p-nav-item">
         
          <Tooltip title="Account">
            <IconButton 
              aria-label="Profile" 
              color="inherit" 
              onClick={() => navigate(`/driver-profile/${userId}`)}>
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          
        </li>

        <li className="d-nav-item">
          <Tooltip title="Logout">
            <IconButton onClick={handleLogout}>
              <ExitToAppIcon />
            </IconButton>
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
};

export default DriverNav;
