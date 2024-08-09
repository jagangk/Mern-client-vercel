import { useState, useContext, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertDescription,
  useDisclosure,
} from "@chakra-ui/react";
import { UserContext } from "../userContext";
import { Helmet } from "react-helmet";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function LoginPage() {
  const navigate = useNavigate();
  const navigateToRegister = () => navigate("/register");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setUserInfo } = useContext(UserContext);

  const {
    isOpen: isErrorOpen,
    onOpen: onOpenError,
    onClose: onCloseError,
  } = useDisclosure();
  useEffect(() => {
    let timer;

    if (isErrorOpen) {
      timer = setTimeout(() => {
        onCloseError();
        setErrorMessage("");
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isErrorOpen]);

  async function login(ev) {
    ev.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/login`;
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.error === "401") {
        setErrorMessage("Account not found");
      } else if (errorData.error === "402") {
        setErrorMessage("Wrong password");
      } else {
        setErrorMessage("Server error, sorry it's our fault");
      }
      onOpenError();
    } else {
      const userInfo = await response.json();
      if (rememberMe) {
        localStorage.setItem("token", userInfo.token);
      } else {
        localStorage.setItem("token", userInfo.token);
      }
      setUserInfo(userInfo);
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      {isErrorOpen && (
        <Alert
          status="error"
          variant="subtle"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="100px"
          colorScheme="red"
          borderRadius="10px"
          maxW="400px"
          mx="auto"
          fontSize="small"
          gap={'5px'}
        >
          <AlertIcon color={"#d83030"} boxSize="30px" mr={0} />
          <AlertDescription maxWidth="sm">{errorMessage}</AlertDescription>
        </Alert>
      )}

      <Helmet>
        <title>Login</title>
      </Helmet>

      <form className="login" onSubmit={login}>
        <h1>Welcome Back!</h1>
        <input
          type="text"
          placeholder="Email or Username"
          value={username}
          required
          autoComplete="username"
          onChange={(ev) => setUsername(ev.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <Link to="/ResetPassword">Forgot password?</Link>

        <button type="submit">Login</button>
        <FormControlLabel
          isInvalid
          onChange={(e) => setRememberMe(e.target.checked)}
          isChecked={rememberMe}
          control={
            <Checkbox
              defaultChecked
              sx={{ fontSize: "small", color: "white" }}
            />
          }
          label="Remember me"
        />
        <h4>New to Blogstera?</h4>
        <button type="button" onClick={navigateToRegister}>
          Create account
        </button>
      </form>
      <div className="contact-div">
        <p>
          You'll be able to access our platform's features after successful
          login. If you encounter any issues during the login process, please
          reach us out <Link to="/contact">click here to contact.</Link>
        </p>
        
      </div>
    </>
  );
}
