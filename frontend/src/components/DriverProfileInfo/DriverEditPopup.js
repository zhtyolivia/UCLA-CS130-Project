import React from 'react';
import './DriverEditPopup.scss';
import axios from 'axios';
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DriverEditPopup = ({ onClose, userProfile, setUserProfile }) => {
    // Note: I'm assuming setUserProfile is a state setter function passed down as a prop
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Here, you would call your backend API to update the driver profile
            const response = await axios.put(`${API_BASE_URL}/driver/update`, userProfile, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('AuthToken')}` // Ensure you're sending the authorization token correctly
                }
            });
            if (response.data.status === 'SUCCESS') {
                console.log("Profile updated successfully", response.data);
                onClose(); // Close the popup on successful update
            } else {
                console.error("Failed to update profile", response.data.message);
                // Handle error (e.g., show an error message)
            }
        } catch (error) {
            console.error("Error updating profile", error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="edit-popup-overlay">
            <div className="edit-popup-content">
                <h3>Edit Driver Information</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userProfile.email || ''}
                        onChange={handleChange}
                    />

                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={userProfile.name || ''}
                        onChange={handleChange}
                    />

                    <label htmlFor="phonenumber">Phone Number</label>
                    <input
                        type="text"
                        id="phonenumber"
                        name="phonenumber"
                        value={userProfile.phonenumber || ''}
                        onChange={handleChange}
                    />

                    {/* Avatar update is not shown here because handling file uploads would require more backend integration. You might want to handle it separately or provide a link for uploading. */}

                    <div className="edit-popup-actions">
                        <button type="button" className="edit-popup-button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="edit-popup-button">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverEditPopup;
