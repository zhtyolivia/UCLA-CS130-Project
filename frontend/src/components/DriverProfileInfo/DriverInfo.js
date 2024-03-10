import React, { useState, useEffect } from 'react';
import './DriverEditPopup.scss'; 
import defaultAvatar from '../../assets/default_avatar.jpeg';
import DriverEditPopup from './DriverEditPopup';

import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DriverInfo = ({name, email, phonenumber}) => {
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [profile, setProfile] = useState({
        name,
        email,
        phonenumber
      });
    const [showDriverPosts, setShowDriverPosts] = useState(false);
    const [showJoinRequests, setShowJoinRequests] = useState(false);
    const [driverPosts, setDriverPosts] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);

    useEffect(() => {
        setProfile({
            name: name,
            email: email,
            phonenumber: phonenumber
        });
      }, [name, email, phonenumber]); // Depend on props to update state
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    }

    const handleEditClick = () => setShowEditPopup(true);

    const handleClosePopup = () => setShowEditPopup(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try{
            const data = await axios.put(`${API_BASE_URL}/driver/update`, profile).then((res) => res.data);
            if (data.status === 'SUCCESS') {
                setProfile(profile)
                console.log(profile)
                console.log(data)
                setShowEditPopup(false); 
                // window.location.reload();
            }
        } catch(err) {
            console.error(err)
        }
    }
    // Fetch driver posts
// Fetch driver posts
    async function fetchMyDriverPosts() {
        try {
        const token = localStorage.getItem('AuthToken'); // Assuming you store your token in localStorage
        const response = await axios.get(`${API_BASE_URL}/driver/my-driver-posts`, {
            headers: {
            'Authorization': `Bearer ${token}`, // Properly formatted authorization header
            },
        });
    
        // Set the driver posts state to the response data
        setDriverPosts(response.data);
    
        // For debugging
        console.log('Driver Posts:', response.data);
        } catch (error) {
        console.error('Error fetching driver posts:', error);
    
        // If the error has a response object, log its details for more information
        if (error.response) {
            console.error('Error Response:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);
        }
        }
    }
  

    // Fetch join requests
    const fetchJoinRequests = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/driver/my-join-requests`);
            setJoinRequests(response.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Toggle driver posts dropdown
    const toggleDriverPosts = () => {
        setShowDriverPosts(!showDriverPosts);
        if (!showDriverPosts) fetchMyDriverPosts();
    };

    // Toggle join requests dropdown
    const toggleJoinRequests = () => {
        setShowJoinRequests(!showJoinRequests);
        if (!showJoinRequests) fetchJoinRequests();
    };

    return (
        <div className="driver-info">
            <div className="driver-avatar">
                {/* Display user's avatar or a default avatar */}
                <img src={defaultAvatar} alt={defaultAvatar} />
                {/* Show the edit info button */}
                <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
            </div>
            <div className="driver-info-content">
                <h3>Driver Information</h3>
                <p><strong>Email:</strong> {email}</p>
                <p><strong>Full Name:</strong> {name}</p>
                <p><strong>Phone Number:</strong> {phonenumber}</p>
                <button className="info-button" onClick={toggleDriverPosts}>My Posts</button>
                <button className="info-button" onClick={toggleJoinRequests}>Join Requests</button>
                {showDriverPosts && (
                    <div className="dropdown-content">
                        {driverPosts.map((post, index) => (
                            <div key={index}>
                                <p>{post.title}</p>
                                {/* Render additional post details */}
                            </div>
                        ))}
                    </div>
                )}
                {showJoinRequests && (
                    <div className="dropdown-content">
                        {joinRequests.map((request, index) => (
                            <div key={index}>
                                <p>{request.message}</p>
                                {/* Render additional request details */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showEditPopup && 
                <DriverEditPopup 
                    onClose={handleClosePopup} 
                    onSubmit={handleSubmit} 
                    onChange={handleChange}
                    profile={profile}
                />
            }
        </div>
    );
}

export default DriverInfo;