import React from 'react';
import { Link } from 'react-router-dom';
import './CarpoolCard.css';

function Post({ id, title, startingLocation, endingLocation, availableSeats, content }) {
  // console.log(id)
  return (
    <div className="post">
      <h2 className="post-title">
        <Link to={`/posts/${id}`} className="post-title">{title}</Link>
      </h2>
      <div className="post-details">
        <p><strong>Starting Location:</strong> {startingLocation}</p>
        <p><strong>Ending Location:</strong> {endingLocation}</p>
        <p><strong>Available Seats:</strong> {availableSeats}</p>
      </div>
      <p className="post-content">{content}</p>
    </div>
  );
}

export default Post;