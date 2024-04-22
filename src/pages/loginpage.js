import { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom"; 
import { Alert, AlertIcon, AlertDescription, useDisclosure} from "@chakra-ui/react";
import { UserContext } from "../userContext"; 

export default function LoginPage() {
    const navigate = useNavigate();
    const navigateToRegister = () => navigate('/register');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserInfo } = useContext(UserContext);

    const { isOpen: isErrorOpen, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
    useEffect(() => {
      let timer;
  
      if (isErrorOpen) {
        timer = setTimeout(() => {
          onCloseError();
          setErrorMessage('');
        }, 3000);
      }
  
      return () => {
        clearTimeout(timer);
      };
    },  [isErrorOpen]);


    async function login(ev) {
        ev.preventDefault();
        const url = `${process.env.REACT_APP_API_URL}/login`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            const userInfo = await response.json();
            document.cookie = `token=${userInfo.token}; path=/`;
            setUserInfo(userInfo);
            setRedirect(true);
        } else {
            const errorMessage = await response.text();
            setErrorMessage(errorMessage); 
            onOpenError();
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <>
            {isErrorOpen && (
              <Alert
              status='error'
              variant='subtle'
              flexDirection='column'
              alignItems='center'
              justifyContent='center'
              textAlign='center'
              height='100px'
              colorScheme="red"
              bg='#d83030'
              borderRadius='10px'
              maxW='60%'
              mx='auto'
              fontSize='small'
          >
              <AlertIcon boxSize='30px' mr={0} />
              <AlertDescription maxWidth='sm'>
                Incorrect password or username.
              </AlertDescription>
            </Alert>
            )}

            <form className="login" onSubmit={login}>
                <h1>Welcome back!</h1>
                <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={ev => setUsername(ev.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={ev => setPassword(ev.target.value)}
                />
                <Link to=''>Forgot password?</Link>

                <button type="submit">Login</button>
                <h4>New to Blogstera?</h4>
                <button onClick={navigateToRegister}>Create account</button>
            </form><div className="contact-div">
        <p>You'll be able to access our platform's features after successful login. If you encounter any issues during the registration process, please reach us out <Link to='/contact'>click here to contact.</Link></p>
       </div></>
    );
}
