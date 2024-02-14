// App.js
import React from 'react';
import './App.css';
import Navigation from './Navigation';
import Post from './Post';

function App() {
  // Sample post data
  const posts = [
    { id: 1, title: 'Post 1', content: 'Content of Post 1' },
    { id: 2, title: 'Post 2', content: 'Content of Post 2' },
    { id: 3, title: 'Post 3', content: 'Content of Post 3' },
    { id: 4, title: 'Post 4', content: 'Content of Post 4' },
    { id: 5, title: 'Post 5', content: 'Content of Post 5' },
    { id: 6, title: 'Post 6', content: 'Content of Post 6' },
    // Add more posts as needed
  ];

  return (
    <div className="App">
      <header>
        <Navigation />
      </header>
      <main className="posts-grid">
        {posts.map(post => (
          <Post key={post.id} title={post.title} content={post.content} />
        ))}
      </main>
    </div>
  );
}

export default App;
