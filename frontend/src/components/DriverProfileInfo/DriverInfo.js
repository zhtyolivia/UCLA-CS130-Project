import React, { useState, useEffect } from 'react';
import './DriverEditPopup.scss'; 
import defaultAvatar from '../../assets/default_avatar.jpeg';
import DriverEditPopup from './DriverEditPopup';

import axios from "axios";
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DriverInfo = ({name, email, phonenumber, avatar}) => {
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [profile, setProfile] = useState({
        name,
        email,
        phonenumber,
        avatar
      });
    const [showDriverPosts, setShowDriverPosts] = useState(false);
    const [showJoinRequests, setShowJoinRequests] = useState(false);
    const [driverPosts, setDriverPosts] = useState([]);
    const [joinRequests, setJoinRequests] = useState([]);

    useEffect(() => {
        setProfile({
            name: name,
            email: email,
            phonenumber: phonenumber,
            avatar: avatar
        });
      }, [name, email, phonenumber, avatar]); // Depend on props to update state
    
      const handleChange = (e) => {
        const { name, value, files } = e.target; 
        if (name === 'avatar') {
            console.log(files[0]);
            setProfile(prev => ({ ...prev, avatar: files[0]}));
            console.log('after setProfile, profile: ', profile)
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
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
            if (profile.avatar && profile.avatar instanceof File) {
                console.log('entering if...', profile.avatar)
                // If there's an avatar, perform a second request to upload avatar 
                const formData = new FormData(); 
                formData.append('avatar', profile.avatar); 
                console.log(formData);
                console.log('profile.avatar:', profile.avatar)
                const avatarResponse = await axios.post(`${API_BASE_URL}/driver/avatar`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const avatarResult = avatarResponse.data; 
                console.log('avatar result: ', avatarResult);
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
        setShowJoinRequests(false); // Hide Join Requests when showing My Posts
        setShowDriverPosts(!showDriverPosts);
        if (!showDriverPosts && !driverPosts.length) {
            fetchMyDriverPosts();
        }
    };

    // Toggle join requests dropdown
    const toggleJoinRequests = () => {
        setShowDriverPosts(false); // Hide My Posts when showing Join Requests
        setShowJoinRequests(!showJoinRequests);
        if (!showJoinRequests && !joinRequests.length) {
            fetchJoinRequests();
        }
    };
    return (
        <div className="driver-info-wrapper">
            <div className="driver-info">
                <div className="driver-info-header">
                    <div className="driver-avatar">
                        <img src={profile.avatar ? (profile.avatar instanceof File ? URL.createObjectURL(profile.avatar) : profile.avatar) : defaultAvatar} alt="Avatar" />
                    </div>
                    <div className="driver-details">
                        <h3>User Information</h3>
                        <p><strong>Username/Email:</strong> {email}</p>
                        <p><strong>Full Name:</strong> {name}</p>
                        <p><strong>Phone number:</strong> {phonenumber}</p>
                    </div>
                </div>
                <div className="button-container">
                    <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
                    <div className="post-request-buttons">
                        <button className="info-button" onClick={toggleDriverPosts}>My Posts</button>
                        <button className="info-button" onClick={toggleJoinRequests}>Join Requests</button>
                    </div>
                </div>


                {showDriverPosts && (
                    <div className="posts-container">
                        {driverPosts.map((post, index) => (
                            <div key={index} className="post-card">
                                <h4>{post.title}</h4>
                                <p><strong>Starting Location:</strong> {post.startingLocation}</p>
                                <p><strong>Ending Location:</strong> {post.endingLocation}</p>
                                <p><strong>Start Time:</strong> {new Date(post.startTime).toLocaleString()}</p>
                                <p><strong>Seats Available:</strong> {post.numberOfSeats}</p>
                                <p><strong>License Number:</strong> {post.licensenumber}</p>
                                <p><strong>Car Model:</strong> {post.model}</p>
                                <p><strong>Additional Notes:</strong> {post.additionalNotes}</p>
                            </div>
                        ))}
                    </div>
                )}
                {showJoinRequests && (
                <div className="requests-container">
                    {joinRequests.map((request, index) => (
                    <div key={index} className="request-card">
                        <p>{request.message}</p>
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
