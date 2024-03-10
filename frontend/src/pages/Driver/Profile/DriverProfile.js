import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import DriverNav from '../../../components/Navigation/DriverNavbar';
import DriverInfo from '../../../components/DriverProfileInfo/DriverInfo';
import './DriverProfile.scss';
import axios from 'axios';
import { isLoggedIn } from '../../../utils/LoginActions';
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

const DriverProfile = () => {
    const [rideHistory, setRideHistory] = useState([]);
    const [email, setEmail] = useState(''); 
    const [name, setName] = useState(''); 
    const [phonenumber, setPhonenumber] = useState(''); 

    useEffect(() => {
            const getDriverProfile = async () => {
                try {
                    const data = await axios.get(`${API_BASE_URL}/driver/profile`).then((res) => res.data);
                    setRideHistory(data.driverposts || []); 
                    setEmail(data.email); 
                    setPhonenumber(data.phonenumber); 
                    setName(data.name); 
    
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
                <DriverInfo name={name} email={email} phonenumber={phonenumber} />
            </div>
        </>
    );
};

export default DriverProfile;
