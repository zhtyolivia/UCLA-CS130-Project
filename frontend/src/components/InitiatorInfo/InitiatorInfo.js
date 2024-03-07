// Displays information about the driver who initiated this rideshare.
// Used for the Post page. 

import React, { useState, useEffect } from 'react';
import './InitiatorInfo.css'; 
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../services/mockAPI'; // Import the mock API function
import defaultAvatar from '../../assets/default_avatar.jpeg';

const InitiatorInfo = () => {
    const [post, setPost] = useState(null);
    const { id } = useParams(); 
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await fetchPostById(Number(id));
                setPost(data);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        fetchPost();
    }, [id]); 

    // If post is null or still loading, display a loading indicator
    if (!post) {
        return <div>Loading...</div>;
    }

    // If post is available, render the user information
    // src={post.user.avatarUrl}
    return (
        <div className="user-info">
            <div className="user-avatar">
                <img src={defaultAvatar} alt={defaultAvatar} />
            </div>
            <div>
                <div className="user-info-header"> 
                    <h3>User Information</h3>
                </div>
                <div className="user-details">
                    <p><strong>Username:</strong> {post.user.username}</p>
                    <p><strong>Full Name:</strong> {post.user.fullName}</p>
                    <p><strong>Email:</strong> {post.user.email}</p>
                </div>
            </div>
        </div>
    );
    
}

export default InitiatorInfo;
