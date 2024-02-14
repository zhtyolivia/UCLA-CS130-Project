import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import PostPage from './PostPage'; 
ReactDOM.render(
  <Router>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/posts/:postId" element={<PostPage />} /> {/* route for post page */}
    </Routes>
  </Router>,
  document.getElementById('root')
);