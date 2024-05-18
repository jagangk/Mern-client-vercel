import { useState, useEffect, useContext } from "react";
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import { Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { UserContext } from "../userContext"; 

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [interestType, setInterestType] = useState('');
    const [password, setPassword] = useState('');
    const { setUserInfo } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { isOpen: isSuccessOpen, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();
    const { isOpen: isErrorOpen, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();

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

    const handleLogin = async (username, password) => {
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
          console.log(errorMessage); 
      }
  };

  if (redirect) {
    return <Navigate to={'/'} />;
}

    async function register(ev) {

        ev.preventDefault();
                const url = `${process.env.REACT_APP_API_URL}/register`;
                const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({username,password, email, interestType}),
                headers: {'Content-Type':'application/json'},
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              if (errorData.error === "401") {
                  setErrorMessage("Password must be at least 4 characters long");
              } else if (errorData.error === "402") {
                  setErrorMessage("Username already exists");
              }
              else if (errorData.error === "403") {
                setErrorMessage("Email already exists")
              } else {
                  setErrorMessage("Failed to create account");
              }
              onOpenError();
          } else {
              setSuccessMessage('Account created!');
              onOpenSuccess();
              await handleLogin(username, password);
          }
    }

    return (
        <>
        <Helmet>
                <title>Create an account</title>
                <meta name="description" content="Sign up to blogstera today and unlock exclusive benefits! Sign up now to access premium content, receive updates, and connect with like-minded individuals. Start your journey with us and discover new opportunities to learn, grow, and thrive." />
        </Helmet>

        <form class ="register" onSubmit={register}>
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
        >
          <AlertIcon boxSize='30px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {successMessage}
          </AlertTitle>
        </Alert>
      )}

      {isErrorOpen && (
        <Alert
          status='error'
          variant='subtle'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='80px'
          colorScheme="red"
          bg='#d83030'
          borderRadius='10px'
          fontSize='small'
        >
          <AlertIcon boxSize='30px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            {errorMessage}
          </AlertTitle>
        </Alert>
      )}

       <h1>Create account</h1>
        
        <input type="text" 
        placeholder="Username"
        value={username}
        required
        onChange={ev => setUsername(ev.target.value.replace(/\s/g, ''))}
        />

        <input type="email"
        placeholder="Email"
        value={email}
        required
        onChange={ev => setEmail(ev.target.value)}
        />

      <select id="PostType" value={interestType} onChange={(ev) => {setInterestType(ev.target.value)}} required>
          <optgroup>
          <option disabled value="">Select your favourite topic</option>
            <option>Business</option>
            <option>News</option>
            <option>Science</option>
            <option>Technology</option>
            <option>Entertainment</option>
            <option>Sports</option>
            <option>Health</option>
            <option>Lifestyle</option>
            <option>Travel</option>
            <option>Food</option>
            <option>Opinions</option>
          </optgroup>
      </select>
        
        <input type="password" 
        placeholder="Password" 
        value={password}
        required
        onChange={ev => setPassword(ev.target.value)}
        />
        
        <button>Register</button>
       </form>
       <div className="contact-div">
        <p>After registering, you'll be able to log in and access our platform's features. If you encounter any issues during the registration process, please reach us out <Link to='/contact'>click here to contact.</Link></p>
       </div></>
    );
}

