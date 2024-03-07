import React, { useState, useEffect } from 'react';
import Navigation from '../../../components/Navigation/PassengerNavbar';
import PassengerInfo from '../../../components/PassengerProfileInfo/PassengerProfileInfo';
import { getCurrentUserId, getUserProfile } from '../../../services/mockAPI';
import './PassengerProfile.scss';

const PassengerProfile = () => {
    

    return (
        <div>
          <header>
            <Navigation />
          </header>
          <div className="PostPage">
            <PassengerInfo />
            </div>
        </div>
    );
};

export default PassengerProfile;