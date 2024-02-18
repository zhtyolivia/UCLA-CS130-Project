// App.js
import React, { useState, useEffect } from 'react';
import './PassengerHome.css';
import Navigation from './Navigation';
import Post from './Post';
import { fetchPosts } from './mockAPI';

function App() {

  const [posts, setPosts] = useState([]); // Initialize posts state to an empty array

  useEffect(() => {
    fetchPosts().then(data => {
      setPosts(data); // Update the posts state with fetched data
    });
  }, []); 

  console.log(posts)
  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main className="posts-grid">
        {posts.map(post => (
          <Post id={post.id} title={post.title} startingLocation={post.startingLocation} endingLocation={post.endingLocation} availableSeats={post.remainingSeats} content={post.content} />
        ))}
      </main>
    </div>
  );
}

export default App;
