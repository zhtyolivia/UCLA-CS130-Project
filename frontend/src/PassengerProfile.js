import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { getCurrentUserId, getUserProfile } from './mockAPI';
import './PassengerProfile.css';

const PassengerProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    // Form states
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        getCurrentUserId().then(userId => {
            getUserProfile(userId).then(profile => {
                setUserProfile(profile);
                // Initialize form with current profile data
                setUsername(profile.username);
                setEmail(profile.email);
                setFullName(profile.name);
            });
        });
    }, []);

    const handleEditClick = () => {
        setShowEditPopup(true);
    };

    const handleClosePopup = () => {
        setShowEditPopup(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here, you would handle updating the user profile
        console.log(username, email, fullName, avatar);
        // Assuming a function to update the profile...
        // updateUserProfile({ username, email, fullName, avatar });
        setShowEditPopup(false);
    };

    if (!userProfile) {
        return <div>Loading profile...</div>;
    }

    return (
        <div>
            <header>
                <Navigation />
            </header>
            <div className="ProfilePage">
                <div className="user-info">
                    <div className="user-avatar">
                        <img src={userProfile.avatarUrl} alt="User Avatar" />
                    </div>
                    <div className="user-details">
                        <div className="user-info-header">
                            <h3>User Information</h3>
                            <button onClick={handleEditClick} className="edit-button">Edit Profile</button>
                        </div>
                        <p><strong>Username:</strong> {userProfile.username}</p>
                        <p><strong>Full Name:</strong> {userProfile.name}</p>
                        <p><strong>Email:</strong> {userProfile.email}</p>
                    </div>
                </div>
                {showEditPopup && (
                    <div className="edit-popup">
                        <form onSubmit={handleSubmit}>
                            <label>Username:
                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </label>
                            <label>Email:
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </label>
                            <label>Full Name:
                                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </label>
                            <label>Avatar:
                                <input type="file" onChange={(e) => setAvatar(e.target.files[0])} />
                            </label>
                            <button type="submit">Submit</button>
                            <button type="button" onClick={handleClosePopup}>Cancel</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PassengerProfile;