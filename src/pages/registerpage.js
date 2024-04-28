import { useState, useEffect } from "react";
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import { useNavigate, Link } from 'react-router-dom';


export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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

    const navigate = useNavigate();
    async function register(ev) {

        ev.preventDefault();
                const url = `${process.env.REACT_APP_API_URL}/register`;
                const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({username,password}),
                headers: {'Content-Type':'application/json'},
            });
            if (response.ok === false ) {
                setErrorMessage('Minimum Username and password length : 4');
                onOpenError();
            } else {
                setSuccessMessage('Account created!');
                onOpenSuccess();
                navigate('/login');
            }       
    }



    return (
        <><form class ="register" onSubmit={register}>
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

       <h1>Hola!</h1>
        
        <input type="text" 
        placeholder="Enter username"
        value={username}
        required
        onChange={ev => setUsername(ev.target.value)}
        />
        
        <input type="password" 
        placeholder="Password" 
        value={password}
        required
        onChange={ev => setPassword(ev.target.value)}
        />
        
        <button>Register</button>
       </form>
       <div className="contact-div">
        <h3>Requirements</h3>
        <p><strong>Username:</strong> Your username must be unique and at least 4 characters long. Make sure to choose a username that reflects your identity and is easy for you to remember.</p>
        <p><strong>Password:</strong> For security reasons, your password must also be a minimum of 4 characters long. Please choose a strong password that includes a combination of letters, numbers, and special characters to ensure the safety of your account.</p>
        <p>After registering, you'll be able to log in and access our platform's features. If you encounter any issues during the registration process, please reach us out <Link to='/contact'>click here to contact.</Link></p>
       </div></>
    );
}

