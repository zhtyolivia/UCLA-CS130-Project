import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DriverHome.scss'; 
import DriverNav from '../../../components/Navigation/DriverNavbar'; 
import Post from '../../../components/RideshareCard/RideshareCard';
import { fetchPosts } from '../../../services/mockAPI';

const DriverHome = () => {
    const [driverRides, setDriverRides] = useState([]);
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]); // Initialize posts state to an empty array

    useEffect(() => {
        fetchPosts().then(data => {
        setPosts(data); // Update the posts state with fetched data
        });
    }, []);

    return (
        <div className="Home">
          <header>
            <DriverNav />
          </header>
          <main className="posts-grid">
            {posts.map(post => (
              <Post id={post.id} title={post.title} startingLocation={post.startingLocation} endingLocation={post.endingLocation} availableSeats={post.remainingSeats} content={post.content} />
            ))}
          </main>
        </div>
      );
    }

export default DriverHome;
