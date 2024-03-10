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

    const fetchMyDriverPosts = async () => {
        try {
            const token = localStorage.getItem('AuthToken');
            const response = await axios.get(`${API_BASE_URL}/driver/my-driver-posts`, {
                headers: { 'Authorization': token },
            });
            setDriverPosts(response.data);
            console.log('Fetched Driver Posts:', response.data);

        } catch (error) {
            console.error('Error fetching driver posts:', error.response ? error.response.data : error.message);
        }
    };
    
    const fetchJoinRequests = async () => {
        try {
            const token = localStorage.getItem('AuthToken');
            const response = await axios.get(`${API_BASE_URL}/driver/my-join-requests`, {
                headers: { 'Authorization': token },
            });
            setJoinRequests(response.data);
            console.log('Fetched Join Requests:', response.data);

        } catch (error) {
            console.error('Error fetching join requests:', error.response ? error.response.data : error.message);
        }
    };

    // Toggle driver posts dropdown
    const toggleDriverPosts = () => {
        setShowDriverPosts(!showDriverPosts);
        if (!showDriverPosts && !driverPosts.length) {
            fetchMyDriverPosts();
        }
    };

    // Toggle join requests dropdown
    const toggleJoinRequests = () => {
        setShowJoinRequests(!showJoinRequests);
        if (!showJoinRequests && !joinRequests.length) {
            fetchJoinRequests();
        }
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
                            <div key={index} className="post-detail">
                                <p><strong>Title:</strong> {post.title}</p>
                                <p><strong>Starting Location:</strong> {post.startingLocation}</p>
                                <p><strong>Ending Location:</strong> {post.endingLocation}</p>
                                <p><strong>Start Time:</strong> {new Date(post.startTime).toLocaleString()}</p>
                                <p><strong>Seats Available:</strong> {post.numberOfSeats}</p>
                                <p><strong>License Number:</strong> {post.licensenumber}</p>
                                <p><strong>Car Model:</strong> {post.model}</p>
                                <p><strong>Additional Notes:</strong> {post.additionalNotes}</p>
                                {/* Add any other details you wish to display here */}
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
