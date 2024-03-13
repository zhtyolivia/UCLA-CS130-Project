/* Part of this file was leveraged from GPT */ 
import React, { useState, useEffect } from 'react';
import { useNavigate,Navigate } from 'react-router-dom';
import DriverNav from '../../../components/Navigation/DriverNavbar';
import DriverInfo from '../../../components/DriverProfileInfo/DriverInfo';
import './DriverProfile.scss';
import axios from 'axios';
import { isLoggedIn } from '../../../utils/LoginActions';
import { API_BASE_URL } from '../../../services/api';


const DriverProfile = () => {
    const [rideHistory, setRideHistory] = useState([]);
    const [email, setEmail] = useState(''); 
    const [name, setName] = useState(''); 
    const [phonenumber, setPhonenumber] = useState(''); 
    const [avatar, setAvatar] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
            const getDriverProfile = async () => {
                try {
                    const token = localStorage.getItem('AuthToken');
                    const data = await axios.get(`${API_BASE_URL}/driver/profile`, {
                        headers: { 'Authorization': token },
                    }).then((res) => res.data);
                    console.log("Fetched driver profile data:", data);
                    setRideHistory(data.driverposts || []); 
                    setEmail(data.email); 
                    setPhonenumber(data.phonenumber); 
                    setName(data.name); 
                    setAvatar(data.avatar);    
                } catch (err) {
                    console.error(err);
                }
            };
            getDriverProfile();
    }, []);

    if (!isLoggedIn()) {
        return <Navigate to="/welcome" />;
    }

    return (
        <>
            <DriverNav />
            <div className="DriverProfile">
                <DriverInfo name={name} email={email} phonenumber={phonenumber} avatar={avatar} />
            </div>
        </>
    );
};

export default DriverProfile;