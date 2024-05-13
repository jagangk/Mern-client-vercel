import { useState, useEffect } from "react";
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';


export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [interestType, setInterestType] = useState('');
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
                body: JSON.stringify({username,password, email, interestType}),
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
        <>
        <Helmet>
                <title>Login</title>
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

       <h1>Hola!</h1>
        
        <input type="text" 
        placeholder="Username"
        value={username}
        required
        onChange={ev => setUsername(ev.target.value)}
        />

        <input type="email"
        placeholder="Email"
        value={email}
        required
        onChange={ev => setEmail(ev.target.value)}
        />

      <select id="PostType" value={interestType} onChange={(ev) => {setInterestType(ev.target.value)}} required>
          <optgroup>
            <option disabled value="">Interested Topic</option>
            <option>Business</option>
            <option>News</option>
            <option>Science and Technology</option>
            <option>Entertainment</option>
            <option>Sports</option>
            <option>Health</option>
            <option>Lifestyle and Travel</option>
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

