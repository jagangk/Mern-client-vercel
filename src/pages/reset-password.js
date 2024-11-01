import { Helmet } from "react-helmet";
import { useState, useContext, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../userContext";
import { Alert, AlertIcon, AlertTitle, useDisclosure } from "@chakra-ui/react";

export default function ChangePassword() {
  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfrimPassword] = useState("");
  const { setUserInfo } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const {
    isOpen: isSuccessOpen,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
  const {
    isOpen: isErrorOpen,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure();

  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
      timer = setTimeout(() => {
        onCloseSuccess();
        setSuccessMessage("");
      }, 3000);
    }

    if (isErrorOpen) {
      timer = setTimeout(() => {
        onCloseError();
        setErrorMessage("");
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isSuccessOpen, isErrorOpen]);

  const handleLogin = async (username, password) => {
    const url = `${process.env.REACT_APP_API_URL}/login`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (response.ok) {
      const userInfo = await response.json();
      document.cookie = `token=${userInfo.token}; path=/`;
      setUserInfo(userInfo);
      setSuccessMessage("Password updated");
      onOpenSuccess();
      setRedirect(true);
    } else {
      const errorMessage = await response.text();
      console.log(errorMessage);
      setErrorMessage("Failed to update");
      onOpenError();
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      onOpenError();
      return;
    }

    try {
      const url = `${process.env.REACT_APP_API_URL}/ResetPassword`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage("Failed to update password");
        onOpenError();
      } else {
        setSuccessMessage("Password successfully updated.");
        onOpenSuccess();
        await handleLogin(identifier, newPassword);
      }
    } catch (error) {
      setErrorMessage(error.message);
      onOpenError();
    }
  };

  return (
    <>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>

      <form className="login" onSubmit={handleSubmit}>
        {isSuccessOpen && (
          <Alert
            status="success"
            variant="subtle"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="80px"
            colorScheme="red"
            borderRadius="10px"
            fontSize="small"
            gap={'5px'}
          >
            <AlertIcon color={"#6dcaae"} boxSize="30px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {successMessage}
            </AlertTitle>
          </Alert>
        )}

        {isErrorOpen && (
          <Alert
            status="error"
            variant="subtle"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="80px"
            colorScheme="red"
            borderRadius="10px"
            fontSize="small"
            gap={'5px'}
          >
            <AlertIcon color={"#d83030"} boxSize="30px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              {errorMessage}
            </AlertTitle>
          </Alert>
        )}

        <h1>Reset Password</h1>
        <input
          type="text"
          placeholder="Email or UserName"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfrimPassword(e.target.value)}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
