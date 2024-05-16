import { useState, useEffect } from "react";
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";
import Footer from "../footer";
import { Helmet } from 'react-helmet';


export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState('');
  const [catchMessage, setCatchMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { isOpen: isSuccessOpen, onOpen: onOpenSuccess, onClose: onCloseSuccess } = useDisclosure();
  const { isOpen: isErrorOpen, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();
  const { isOpen: isCatchOpen, onOpen: onOpenCatch, onClose: onCloseCatch } = useDisclosure();

  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
      timer = setTimeout(() => {
        onCloseSuccess();
        setSuccessMessage('');
      }, 3000);
    }

    if (isErrorOpen) {
      timer = setTimeout(() => {
        onCloseError();
        setErrorMessage('');
      }, 3000);
    }

    if (isCatchOpen) {
      timer = setTimeout(() => {
        onCloseCatch();
        setCatchMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isSuccessOpen, isErrorOpen, isCatchOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${process.env.REACT_APP_API_URL}/contact`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, query }),
      });

      if (response.ok) {
        setSuccessMessage("Thanks for your contact!");
        onOpenSuccess(); 
      } else {
        setErrorMessage("Please fill out all the fields.");
        onOpenError();
      }
    } catch (error) {
      setCatchMessage("An error occurred while submitting the form.");
      onOpenCatch(); 
    }
  };

  return (
    <>
      <Helmet>
                <title>Login</title>
                <meta name="description" content="We're always eager to hear from you! Whether you have feedback, questions, business inquiries, or just want to say hello, please don't hesitate to get in touch with us. Your thoughts and concerns are important to us, and we're committed to providing you with the best possible support." />
        </Helmet>
    <form className="contact" onSubmit={handleSubmit}>
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

      {isCatchOpen && (
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
            {catchMessage}
          </AlertTitle>
        </Alert>
      )}
    
      <h1>Let's Connect!</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(ev) => setName(ev.target.value)} />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(ev) => setEmail(ev.target.value)} />

      <textarea
        type="text"
        value={query}
        onChange={(ev) => setQuery(ev.target.value)} />
      <button>Submit</button>
  
    </form>
    <div className="contact-div">
      <h3>Business Inquiries</h3>
      <p>Interested in partnering with us or have a business proposal? Please reach us out at <a target="_blank" href="mailto:blogsteratech@gmail.com">blogsteratech@gmail.com</a>.</p>
      </div>
      <Footer />
      </>
  );
}

