import { Helmet } from 'react-helmet';
import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";

export default function UpdateProfile() {
    const [email, setEmail] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [interestType, setInterestType] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = `${process.env.REACT_APP_API_URL}/UpdateProfile`;
            const response = await fetch( url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, interestType, identifier}),
            });

            if (!response.ok) {
                setErrorMessage("Failed to update");
                onOpenError();
            }
            else {
                setSuccessMessage("Profile updated");
                onOpenSuccess();
                setRedirect(true);
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
          if (redirect) {
            navigate(-1); 
          }
        }, 3000); 
      
        return () => clearTimeout(timeoutId);
      }, [redirect]); 
    
    return (
        <><Helmet>
            <title>Update Profile</title></Helmet>
        <form onSubmit={handleSubmit} className="login">
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
            <h1>Update Profile</h1>
            <input
                    type="text"
                    placeholder="Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required />

            <input
                type="text"
                placeholder="New Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />

     <select id="PostType" value={interestType} onChange={(ev) => {setInterestType(ev.target.value)}} required>
          <optgroup>
          <option disabled value="">Select your new favourite topic</option>
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

            <button type="submit">Submit</button>
        </form>
        <div className='report-div'>
                <p>If you encounter any issues during the process, please reach us out <Link to='/contact'>click here to contact.</Link></p>
        </div>
        </>
    );
}