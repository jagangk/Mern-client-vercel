import { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './userContext';

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
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

  //logout
  async function logout() {
    const url = `${process.env.REACT_APP_API_URL}/logout`;
    const response = await fetch(url, {
      credentials: 'include',
      method: 'POST',
    });

    if (response.ok) {
      alert('Log out successful');
      navigate('/');
      setUserInfo(null);
    }
  }

  const username = userInfo?.username;

  return (
    <header>
      <div className="logo">
          <Link to="/"><img className="icon" src="/b.png" alt="Blog Logo"/></Link>
          <Link className="web-title" to="/">Blogstera</Link>
      </div>
      <nav>
        {username ? (
          <>
            <div className="dropdown">
              <span>
                Welcome<Link className="dropbtn"> {username}</Link>
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
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/contact">Contact</Link>
          </>
        )}
      </nav>
    </header>
  );
}
