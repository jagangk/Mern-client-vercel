import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${username}`);
        const fetchedUser = await response.json();
        setUserData(fetchedUser);

        const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts/user/${fetchedUser._id}`);
        const fetchedPosts = await postResponse.json();
        setUserPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally{
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);


  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await fetch(`${process.env.REACT_APP_API_URL}/post/${postId}`, {
          method: 'DELETE',
        });
        setUserPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };
  

  if (loading) {
    return  <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
  }

  return (
    <>
    <Helmet><title>Profile {userData.username}</title></Helmet>
    <div className="user-profile">
      {userData && (
        <>
          <div className='user-data'>
            <div className='user-data-update'>
              <h2>Edit Profile</h2>
              <Link to="/UpdateProfile"><span class="material-symbols-outlined">edit</span></Link>
            </div>
            <div className='user-profile-edit'>
              <p>{userData.username}</p>
              <span class="material-symbols-outlined">account_circle</span>
            </div>
            <div className='user-profile-edit'>
              <p>{userData.email}</p>
              <span class="material-symbols-outlined">mail</span>
            </div>
            <div className='user-profile-edit'>
              <p>{userData.interestType}</p>
              <span class="material-symbols-outlined">interests</span>
            </div>
          </div>
        </>
      )}
      <div className='post-data-header'>
        <h2>Posts Uploaded</h2>
        <span class="material-symbols-outlined">cloud</span>
      </div>
      {userPosts.map((post) => (
        <div className='post-container' key={post._id}>
        <img alt='cover' src={post.cover}></img>
        <div className='text-container'>
          <p className='post-title'>{post.title}</p>
        </div>
        <div className='user-icons'>
          <Link to={`/edit/${post._id}`}>
            <span className="material-symbols-outlined">edit</span></Link>
          <Link 
            to="#"
            onClick={(e) => { e.preventDefault(); handleDelete(post._id); }}>
            <span className="material-symbols-outlined">delete</span>
          </Link>
        </div>
      </div>
      ))}
    </div></>
  );
}

export default UserProfile;