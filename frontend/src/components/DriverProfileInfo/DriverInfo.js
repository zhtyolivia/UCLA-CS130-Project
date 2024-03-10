// import React, { useState, useEffect } from 'react';
// import './DriverInfo.scss';
// import defaultAvatar from '../../assets/default_avatar.jpeg';
// import DriverEditPopup from './DriverEditPopup';
// import axios from "axios";

// export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// const DriverInfo = ({ email, name, phonenumber }) => {
//     const [showEditPopup, setShowEditPopup] = useState(false);
//     const [profile, setProfile] = useState({
//         email,
//         name,
//         phonenumber,
//     });

//     // Update the profile state whenever the props change
//     useEffect(() => {
//         setProfile({
//             email: email,
//             name: name,
//             phonenumber: phonenumber,
//         });
//     }, [email, name, phonenumber]);

//     const handleEditClick = () => setShowEditPopup(true);
//     const handleClosePopup = () => setShowEditPopup(false);
    
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProfile(prevProfile => ({
//             ...prevProfile,
//             [name]: value,
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault(); 

//         try{
//             const data = await axios.put(`${API_BASE_URL}/driver/update`, profile).then((res) => res.data);
//             if (data.status === 'SUCCESS') {
//                 setProfile(profile)
//                 console.log(profile)
//                 console.log(data)
//                 setShowEditPopup(false); 
//                 // window.location.reload();
//             }
//         } catch(err) {
//             console.error(err)
//         }
//     }


//     return (
//         <div className="driver-info-wrapper">
//             <div className="driver-info">
//                 <div className="driver-avatar">
//                     <img src={profile.avatar || defaultAvatar} alt="Driver Avatar" />
//                     <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
//                 </div>
//                 <div className="driver-info-content">
//                     <div className="driver-info-header">
//                         <h3>Driver Information</h3>
//                     </div>
//                     <div className="driver-details">
//                         <p><strong>Name:</strong> {name}</p>
//                         <p><strong>Email:</strong> {email}</p>
//                         <p><strong>Phone Number:</strong> {phonenumber}</p>
//                     </div>
//                 </div>
//             </div>

//             {showEditPopup && (
//                 <DriverEditPopup 
//                     onClose={handleClosePopup}
//                     Profile={profile}
//                     onSubmit={handleSubmit}
//                     onChange={handleChange} // Pass the update handler
//                 />
//             )}
//         </div>
//     );
// };

// export default DriverInfo;
import React, { useState, useEffect } from 'react';
import { getCurrentUserId, getUserProfile } from '../../services/mockAPI';
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

    return (
        <div className="driver-info">
            <div className="driver-avatar">
                {/* Display user's avatar or a default avatar */}
                <img src={defaultAvatar} alt={defaultAvatar} />
                {/* Show the edit info button */}
                <button className="edit-button" onClick={handleEditClick}>Edit Profile</button>
            </div>
            <div>
                <div className="driver-info-header"> 
                    <h3>User Information</h3>
                </div>
                <div className="driver-details">
                <p><strong>Username/Email:</strong> {email}</p>
                    <p><strong>Full Name:</strong> {name}</p>
                    <p><strong>Phone number:</strong> {phonenumber}</p>
                </div>
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