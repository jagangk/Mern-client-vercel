import { useContext, useState } from 'react';
import {Navigate, useNavigate} from 'react-router-dom';
import { UserContext } from '../userContext';


export default function LoginPage (){


    /*----------------------existing user function--------*/
    const navigate = useNavigate();
    const navigateToregister = () => navigate('/register');
    

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUserInfo} = useContext(UserContext);

  /*---------------------login function------------------*/
  async function login(ev) {
    ev.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/login`;
    const response = await fetch (url,{
      method: 'POST',
      body: JSON.stringify({username,password}),
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
    });
    if (response.ok) {
      response.json().then(userInfo =>{
        document.cookie = `token=${userInfo.token}; path=/`;
        setUserInfo(userInfo);
        setRedirect(true);

      })
      
    } else{
      alert("Wrong credentials")
    }
  }
  if (redirect) {
    return <Navigate to={'/'} />
  }


    
    return (
       <form class= "login" onSubmit={login}>
        <h1>Welcome back!</h1>
        <input type="text" 
        placeholder="Enter username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        />
        
        <input type="password"
         placeholder="Password"
         value={password}
         onChange={ev => setPassword(ev.target.value)}
        />
        
        
        <button>Login</button>
        <h4>New to Blogstera?</h4>
        <button onClick={navigateToregister}>Create account</button>
       </form>
    );
}