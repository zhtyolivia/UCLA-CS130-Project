import React from 'react';
import Navigation from './Navigation';
import './PostPage.css'; // Import CSS file for styling

function PostPage() {
  // Dummy data for the user and post
  const user = {
    username: 'john_doe',
    fullName: 'John Doe',
    email: 'john@example.com',
    avatarUrl: 'https://example.com/avatar.png' // URL to user avatar
  };

  const post = {
    id: 1,
    title: 'Post Title',
    startingLocation: 'Start Location',
    endingLocation: 'End Location',
    remainingSeats: 5,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  };

  return (
    <div >
      <header>
        <Navigation />
      </header>
      
      <div className="PostPage">
        <div className="user-info">
            <div className="user-avatar">
            <img src={user.avatarUrl} alt="User Avatar" />
            </div>
            <div className="user-details">
            <h3>User Information</h3>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Full Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            </div>
        </div>
        <div className="post-details">
            <h2>{post.title}</h2>
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