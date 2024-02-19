import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from './Navigation';
import { fetchPostById } from './mockAPI'; // Import the mock API function
import './PostPage.css';

function PostPage() {
  const [post, setPost] = useState(null);
  const [showRequestPopup, setShowRequestPopup] = useState(false);
  const { id } = useParams(); 

  useEffect(() => {
    fetchPostById(Number(id)).then(data => {
      setPost(data);
    });
  }, [id]); 

  const handleRequestClick = () => {
    setShowRequestPopup(true);
  };

  const handleClosePopup = () => {
      setShowRequestPopup(false);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      setShowRequestPopup(false);
  };

  if (!post) {
    return <div>Loading post...</div>; // Show loading state while the post is being fetched
  }

  return (
    <div>
      <header>
        <Navigation />
      </header>
      <div className="PostPage">
        <div className="user-info">
            <div className="user-avatar">
              <img src={post.user.avatarUrl} alt="User Avatar" />
            </div>
            <div className="user-details">
              <div classname="user-info-header"> 
                <h3>User Information</h3>
                
              </div>
              <p><strong>Username:</strong> {post.user.username}</p>
              <p><strong>Full Name:</strong> {post.user.fullName}</p>
              <p><strong>Email:</strong> {post.user.email}</p>
            </div>
        </div>
        <div className="post-details">
          <h2>{post.title}</h2>
            <div className='edit-container'>
            <button className="edit-button">Send join request</button>
            </div>
            
            <p><strong>Start Location:</strong> {post.startingLocation}</p>
            <p><strong>End Location:</strong> {post.endingLocation}</p>
            <p><strong>Remaining Seats:</strong> {post.remainingSeats}</p>
        </div>
        <div className="post-content">
            <p>{post.content}</p>
        </div>
      </div>
    </div>
  );
}

export default PostPage;