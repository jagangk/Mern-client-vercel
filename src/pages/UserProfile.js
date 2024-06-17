import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

function UserProfile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState('');
  const [email, setEmail] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { isOpen: isSuccessOpen, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
        timer = setTimeout(() => {
            onCloseSuccess();
            setSuccessMessage('');
        },3000);
    }

    if (isErrorOpen) {
        timer = setTimeout(() => {
          onCloseError();
          setErrorMessage('');
        }, 3000);
      }
      return () => {
        clearTimeout(timer);
      };

}, [isSuccessOpen, isErrorOpen]);

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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const toggleEditMode = () => {
    setEditMode(true);
  };

  const toggleViewMode = () => {
    setEditMode(false);
  }

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();

    const data = new FormData();
    const username = userData.username;
    data.set('file', files[0]);
    data.set('email', email);
    data.set('username', username);
    console.log(files);

    const url = `${process.env.REACT_APP_API_URL}/updateUser`;
    const response = await fetch(url, {
      method: 'PUT',
      body: data,
      credentials: 'include',
    });
    
    if (response.ok) {
      setRedirect(true);
      setSuccessMessage("Profile Updated");
      onOpenSuccess();
    }

    else{
      setErrorMessage("Failed to Update");
      onOpenError();
    }
  };

  useEffect(() => {
    if (redirect) {
      const timeoutId = setTimeout(() => {
        window.location.reload();
      }, 3000);
  
      return () => clearTimeout(timeoutId);
    }
  }, [redirect]);

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
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <>
      <Helmet><title>Profile {userData.username}</title></Helmet>
      <div className="user-profile">

      {isSuccessOpen && (
        <Alert
          status='success'
          flexDirection='row'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          colorScheme="red"
          height={'40px'}
          borderRadius='10px'
          fontSize='small'
          fontWeight={'600'}
          gap={'5px'}
        >
          <AlertIcon color={'#6dcaae'} boxSize='20px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {successMessage}
          </AlertTitle>
        </Alert>
      )}

      {isErrorOpen && (
        <Alert
        status='success'
        flexDirection='row'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        colorScheme="red"
        height={'80px'}
        borderRadius='10px'
        fontSize='small'
        fontWeight={'600'}
        gap={'5px'}
        >
          <AlertIcon color={'red'} boxSize='20px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {errorMessage}
          </AlertTitle>
        </Alert>
      )}

        {userData && (
          <>
            {!editMode ? (
              <div className='user-data-update'>
                <div className='user-profile-edit'>
                  <div className='user-data-box'>
                    <div className='cover-box'>
                      <img className='user-cover' src={userData.icon} alt='user_image' />
                    </div>
                    <p>{userData.username}</p>
                  </div>
                  <div className='user-data-box'>
                    <span className="material-symbols-outlined">mail</span>
                    <p>{userData.email}</p>
                  </div>
                  <div className='user-data-box'>
                    <span className="material-symbols-outlined">interests</span>
                    <p>{userData.interestType}</p>
                  </div>
                  <div className='user-data-box'>
                    <Link onClick={toggleEditMode}><span className="material-symbols-outlined">edit</span></Link>
                    <Link onClick={toggleEditMode} style={{textDecoration:'none'}}><p>Edit Profile</p></Link>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
              
                <div className='user-data-update'>
                <div className='post-data-header'>
                  <p>Update Profile</p>
                  <button  onClick={toggleViewMode}>Cancel</button>
                </div>
                  <div className='user-profile-edit'>
                    <div className='user-data-box'>
                      <div className='cover-box'>
                        <img className='user-cover' src= {userData.icon} alt='user_image' />
                      </div>
                    </div>
                    <div className='user-data-box'>
                      <input
                        type='email'
                        name='email'
                        value={email}
                        onChange={(ev) => setEmail(ev.target.value)}
                        placeholder='New Email'
                        required
                      />
                    </div>
                    <div className='user-data-box'>
                      <input
                        type='file'
                        onChange={(ev) => setFiles(ev.target.files)}
                        required
                      />
                    </div>
                    <div className='user-data-box'>
                      <button type='submit'><span className="material-symbols-outlined">arrow_forward</span></button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </>
        )}

        {userPosts.length > 0 && (
          <div className='post-data-header'>
            <p>Posts Uploaded</p>
            <span className="material-symbols-outlined">cloud</span>
          </div>
        )}

        {userPosts.length === 0 ? (
          <div className='no-post-ack'>
            <p>You haven't posted anything yet.</p>
            <div className='create-post-ack'>
              <Link to='/create'>Create post</Link>
              <span className="material-symbols-outlined">add_circle</span>
            </div>
          </div>
        ) : (
          userPosts.map((post) => (
            <div className='post-container' key={post._id}>
              <img alt='cover' src={post.cover}></img>
              <div className='text-container'>
                <p className='post-title'>{post.title}</p>
              </div>
              <div className='user-icons'>
                <Link to={`/edit/${post._id}`}>
                  <span className="material-symbols-outlined">edit</span>
                </Link>
                <Link 
                  to="#"
                  onClick={(e) => { e.preventDefault(); handleDelete(post._id); }}>
                  <span className="material-symbols-outlined">delete</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default UserProfile;
