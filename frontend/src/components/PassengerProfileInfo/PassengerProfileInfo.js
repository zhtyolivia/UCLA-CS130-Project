import React, { useState, useEffect } from 'react';
import './PassengerProfileInfo.scss'; 
import defaultAvatar from '../../assets/default_avatar.jpeg';
import EditInfoPopup from './EditInfoPopup';
import { SuccessPopup } from '../SuccessPopup/SuccessPopup'; 

import axios from "axios";
import { API_BASE_URL } from '../../services/api';
// export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const PassengerInfo = ({name, email, phonenumber, avatar}) => {
    const [showEditPopup, setShowEditPopup] = useState(false); 
    const [showSuccessPopup, setShowSuccessPopup] = useState(false); 
    const [msg, setMsg] = useState(''); 
    
    const [profile, setProfile] = useState({
        name,
        email,
        phonenumber, 
        avatar
      });
    
    useEffect(() => {
        setProfile({
            name: name,
            email: email,
            phonenumber: phonenumber,
            avatar: avatar
        });

        console.log(profile)
      }, [name, email, phonenumber, avatar]);

    const handleChange = (e) => {
        const { name, value, files } = e.target; 
        if (name === 'avatar') {
            setProfile(prev => ({ ...prev, avatar: files[0]}));
            console.log('after setProfile, profile: ', profile)
        } else {
            setProfile(prev => ({ ...prev, [name]: value }));
        }
    }

    const handleEditClick = () => setShowEditPopup(true);

    const handleClosePopup = () => setShowEditPopup(false);

    const handleSuccess = () => setShowSuccessPopup(true); 

    const handleCloseSuccess = () => {
        setShowSuccessPopup(false); 
        window.location.reload();
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        
        const profileData = {
            'name': profile.name, 
            'email': profile.email, 
            'phonenumber': profile.phonenumber
        }; 

        try{
            // console.log('profileData:', profileData)
            const data = await axios.put(`${API_BASE_URL}/passenger/update`, profileData).then((res) => res.data);
            if (data.status === 'SUCCESS') {
                setProfile(profile)
                setShowEditPopup(false); 
                setMsg('Profile information successfully updated!');
                setShowSuccessPopup(true); 
                
            }
            
            if (profile.avatar) {
                // If there's an avatar, perform a second request to upload avatar 
                const formData = new FormData(); 
                formData.append('avatar', profile.avatar); 
                console.log(formData);
                console.log('profile.avatar:', profile.avatar)
                const avatarResponse = await axios.post(`${API_BASE_URL}/passenger/avatar`, formData, {
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

    return (
        <div className="passenger-info">
            <div className="passenger-avatar">
            <img src={profile.avatar ? profile.avatar : defaultAvatar} alt="Avatar" />
                <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
            </div>
            <div>
                <div className="passenger-info-header"> 
                    <h3>User Information</h3>
                </div>
                <div className="passenger-details">
                <p><strong>Username/Email:</strong> {email}</p>
                    <p><strong>Full Name:</strong> {name}</p>
                    <p><strong>Phone number:</strong> {phonenumber}</p>
                </div>
            </div>
            {showEditPopup && 
                <EditInfoPopup 
                    onClose={handleClosePopup} 
                    onSubmit={handleSubmit} 
                    onChange={handleChange}
                    profile={profile}
                />
            }
            {showSuccessPopup && 
                <SuccessPopup 
                    onClose={handleCloseSuccess} 
                    msg={msg}
                />
            }
        </div>
    );
}

export default PassengerInfo;