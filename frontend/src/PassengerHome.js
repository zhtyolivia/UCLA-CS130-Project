import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import Post from './Post';
import { fetchPosts } from './mockAPI';
import './PassengerHome.css';
import { Link } from 'react-router-dom';

function PassengerHome() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts().then(data => {
      setPosts(data);
    });
  }, []);

  console.log(posts)
  return (
    <div className="PassengerHome">
      <header>
        <Navigation />
        <Link to="/login">Go to Login</Link>
      </header>
      <main className="posts-grid">
        {posts.map(post => (
          <Post 
            id={post.id} 
            title={post.title} 
            startingLocation={post.startingLocation} 
            endingLocation={post.endingLocation} 
            availableSeats={post.remainingSeats} 
            content={post.content} 
          />
        ))}
      </main>
    </div>
  );
}

export default PassengerHome;
