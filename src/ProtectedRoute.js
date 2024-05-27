import React, { useState, useContext, useEffect } from "react";
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';
import { Alert, AlertIcon, AlertDescription, useDisclosure } from "@chakra-ui/react";

const ProtectedRoute = ({ children }) => {
  const { userInfo } = useContext(UserContext);
  const [errorMessage, setErrorMessage] = useState('');
  const { isOpen: isErrorOpen, onOpen: onOpenError, onClose: onCloseError } = useDisclosure();

  useEffect(() => {
    let timer;

    if (!userInfo || !userInfo.username) {
      setErrorMessage("Please log in to access this feature");
      onOpenError();

      timer = setTimeout(() => {
        onCloseError();
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [userInfo, onCloseError, onOpenError]);

  if (!userInfo || !userInfo.username) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
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
          maxW='400px'
          mx='auto'
          fontSize='small'
        >
          <AlertIcon boxSize='30px' mr={0} />
          <AlertDescription maxWidth='sm'>
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default ProtectedRoute;
