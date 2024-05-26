import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UserContext } from '../userContext';
import { useContext } from 'react';

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${username}`);
        const fetchedUser = await response.json();
        setUserData(fetchedUser);

        const postResponse = await fetch(`${process.env.REACT_APP_API_URL}/posts/user/${fetchedUser._id}`);
        const fetchedPosts = await postResponse.json();
        setUserPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [username]);


  return (
    <div className="user-profile">
      {userData && (
        <>
        <div className='user-data'>
            <div className='user-data-update'>
               <h2>{userData?.username}</h2>
               <Link to = "/ResetPassword"><span class="material-symbols-outlined">edit</span></Link>
            </div>
             <div className='user-profile-edit'>
                 <p>Email: {userData.email}</p>
                 <span class="material-symbols-outlined">mail</span>
             </div>
             <div className='user-profile-edit'>
                 <p>Interest: {userData.interestType}</p>
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
            <img src={post.cover}></img>
        <div className='text-container'>
            <p className='post-title'>{post.title}</p>
             <Link to="/delete"><span className="material-symbols-outlined">delete</span></Link>
          </div>    
        </div>
      ))}
    </div>
  );
}

export default UserProfile;