import React, { useState, useEffect } from 'react';
import './UserInfo.css'; // 导入组件的样式文件
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../services/mockAPI'; // Import the mock API function

const UserInfo = () => {
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
    return (
        <div className="user-info">
            <div className="user-avatar">
                <img src={post.user.avatarUrl} alt="User Avatar" />
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

export default UserInfo;
