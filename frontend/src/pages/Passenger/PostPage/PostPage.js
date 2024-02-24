import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navigation from '../../../components/Navigation/Navigation';
import { fetchPostById } from '../../../services/mockAPI'; // Import the mock API function
import UserInfo from '../../../components/UserInfo/UserInfo';
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
      <UserInfo />
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