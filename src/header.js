import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import { UserContext } from './userContext';


export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [successMessage, setSuccessMessage] = useState('');
  const { isOpen: isSuccessOpen, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();
  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
      timer = setTimeout(() => {
        onCloseSuccess();
        setSuccessMessage('');
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isSuccessOpen]);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/profile`;
    const token = userInfo?.token;
    fetch(url,{
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        return response.json();
      })
      .then(userInfo => {
        setUserInfo(userInfo);
      })
      .catch(error => {
        console.error('Error fetching profile:', error.message);
      });
  }, [setUserInfo]);

  async function logout() {
    const url = `${process.env.REACT_APP_API_URL}/logout`;
    const response = await fetch(url, {
      credentials: 'include',
      method: 'POST',
    });

    if (response.ok) {
      setSuccessMessage('Log out successful');
      onOpenSuccess();
      navigate('/');
      setUserInfo(null);
    }
  }

  const username = userInfo?.username;

  return (
  <div className="header-container">
    <header>
      <div className="logo">
          <Link to="/"><img className="icon" src="/b.jpg" alt="Blog Logo"/></Link>
          <Link className="web-title" to="/">Blogstera</Link>
      </div>
      <nav>
        {username ? (
          <>
            <div className="dropdown">
              <span>
                <Link className="dropbtn">Hello {username}</Link>
              </span>
              <div className="dropdown-content">
                <Link to="/create">Create post</Link>
                <Link to="/">Feeds</Link>
                <Link to="/contact">Contact</Link>
                <Link onClick={logout}>Logout</Link>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Sign in</Link>
          </>
        )}
      </nav>
    </header>

    {isSuccessOpen && (
      <Alert
        status='success'
        variant='subtle'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
        textAlign='center'
        height='80px'
        colorScheme="red"
        bg='#6dcaae'
        borderRadius='10px'
        fontSize='small'
        className="alert-box"
      >
        <AlertIcon boxSize='30px' mr={0} />
        <AlertTitle mt={4} mb={1} fontSize='lg'>
          {successMessage}
        </AlertTitle>
      </Alert>
    )}
  </div>
);
}
