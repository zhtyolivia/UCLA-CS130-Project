// PostPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { API_BASE_URL, } from '../../../services/api'; 
// Components 
import Navigation from '../../../components/Navigation/PassengerNavbar'; 
import InitiatorInfo from '../../../components/InitiatorInfo/InitiatorInfo'; 
import JoinReqPopup from '../../../components/JoinReqPopup/JoinReqPopup'; 
import CancelJoinReq from '../../../components/JoinReqPopup/CancelJoinReq'; 
import AcceptedPopup from '../../../components/JoinReqPopup/AcceptedPopup'; 
import { isLoggedIn } from '../../../utils/LoginActions'; 

// Styles 
import './PostPage.scss'; 

import axios from 'axios';

function PostPage() {
  const [post, setPost] = useState(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [showAcceptedPopup, setShowAcceptedPopup] = useState(false);

  const { id } = useParams();
  const [status, setStatus] = useState(''); 
  const [msg, setMsg] = useState(''); 
  const [requested, setRequested] = useState(); 

  useEffect( () => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/driverpost/${id}`);
        const data = response.data; 
        console.log('data:', data);
        setPost(data.driverPost);
        // console.log('driverPost:', data.driverPost); 
        setRequested(data.hasJoined); // whether there is a join request sent previously 
        setStatus(data.joinRequestStatus)
        // console.log('requested:', requested)
      } catch(err) {
        console.error(err); 
      }
    }; 
    getPost();
    
  }, []); 

  const handleRequestClick = () => {
    setShowRequestPopup(true);
  };

  const handleClosePopup = () => {
    setShowRequestPopup(false);
  };

  const handleCancelClick = () => {
    setShowCancelPopup(true); 
  }

  const handleCloseCancel = () => {
    setShowCancelPopup(false); 
  }

  const handleAcceptedClick = () => {
    setShowAcceptedPopup(true); 
  }
  
  const handleCloseAccepted= () => {
    setShowAcceptedPopup(false); 
  }

  const handleInputChange = (e) => {
    setMsg(e.target.value); 
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const body = {
      postId: id, 
      message: msg
    }; 

    try {
      await axios.post(`${API_BASE_URL}/driverpost/${id}/join`, body); 
      // console.log("Join request sent.");
      setShowRequestPopup(false);
      window.location.reload();
    } catch  (err) {
      console.error(err); 
    }
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    // Backend API in development... 
  }; 

  if (!post) {
    return <div>Loading post...</div>;
  }

  // If the user hasn't logged in, navigate to welcome page.
  if (!isLoggedIn()) {
    return <Navigate to="/welcome" />;
  }

  return (
    <div>
      <header>
        <Navigation />
      </header>
      <div className="PostPage">
        
        <div className="post-details">
        <h2>Trip Information</h2>
          {/* <h2>{post.title}</h2> */}
          
          <p><strong>Start Location:</strong> {post.startingLocation}</p>
          <p><strong>End Location:</strong> {post.endingLocation}</p>
          <p><strong>Date & Time:</strong> {post.startTime}</p>
          <p><strong>Remaining Seats:</strong> {post.remainingSeats}</p>
          <p><strong>Description:</strong> {post.additionalNotes}</p>

          {!requested && 
            <div className='join-container'>
              <div className='button-text'>Send a join request to the driver</div> 
              <div className='button-container'>
                <button className="join-button" onClick={handleRequestClick} onChange={handleInputChange}>Request</button>
              </div>
            </div>
          }

          {requested && status=== 'pending' &&  
            <div className='join-container'>
              <div className='button-text'>Request sent to the driver</div> 
              <div className='button-container'>
                <button className="cancel-button" onClick={handleCancelClick} onChange={handleInputChange}>Cancel join request</button>
              </div>
            </div>
          }

          {requested && status=== 'accepted' &&  
            <div className='join-container'>
              <button className="accepted-button" onClick={handleAcceptedClick} onChange={handleInputChange}>Request accepted</button>
            </div>
          }

          <div className="post-content">
            <p>{post.content}</p>
          </div>
        </div>
        {/* Conditionally display further info  */}
        {status === 'accepted' && <InitiatorInfo post={post}/>}

      </div>
      {showRequestPopup &&  <JoinReqPopup onClose={handleClosePopup} onSubmit={handleSubmit} />}
      {showCancelPopup &&  <CancelJoinReq onClose={handleCloseCancel} onSubmit={handleCancelSubmit} />}
      {showAcceptedPopup &&  <AcceptedPopup onClose={handleCloseAccepted} />}
    </div>
  );
}

export default PostPage;
