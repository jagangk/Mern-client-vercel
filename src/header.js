import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { UserContext } from "./userContext";

export default function Header() {
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const {
    isOpen: isSuccessOpen,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  useEffect(() => {
    let timer;

    if (isSuccessOpen) {
      timer = setTimeout(() => {
        onCloseSuccess();
        setSuccessMessage("");
      }, 3000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isSuccessOpen]);

  const navigate = useNavigate();

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/profile`;
    const token = userInfo?.token;
    fetch(url, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }
        return response.json();
      })
      .then((userInfo) => {
        setUserInfo(userInfo);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error.message);
      });
  }, [setUserInfo]);

  useEffect(() => {
    if (userInfo?.username) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/users/${userInfo.username}`
          );
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [userInfo]);

  async function logout() {
    const url = `${process.env.REACT_APP_API_URL}/logout`;
    const response = await fetch(url, {
      credentials: "include",
      method: "POST",
    });

    if (response.ok) {
      setSuccessMessage("Log out successful");
      onOpenSuccess();
      navigate("/");
      setUserInfo(null);
    }
  }

  const username = userInfo?.username;

  return (
    <div className="header-container">
      <header>
        <div className="logo">
          <Link to="/">
            <img className="icon" src="/b.png" alt="Blog Logo" />
          </Link>
          <Link className="web-title" to="/">
            Blogstera
          </Link>
        </div>
        <nav>
          {username ? (
            <Flex align="center" gap="10px">
              <Link
                className="dropbtn"
                to={`/user/${username}`}
                style={{ display: "flex", alignItems: "center" }}
              >
                {userData?.icon ? (
                  <img
                    className="user-cover"
                    src={userData.icon}
                    alt="User Icon"
                    style={{
                      width: "25px",
                      height: "25px",
                      borderRadius: "50%",
                      marginRight: "8px",
                    }}
                  />
                ) : null}
                {username}
              </Link>

              <Link onClick={logout}>
                <div className="gicon-title">
                  <img
                    alt="ai logo"
                    className="promo-icon"
                    src="../logout.png"
                  />
                  <Link className="logout" onClick={logout}>
                    Logout
                  </Link>
                </div>
              </Link>
            </Flex>
          ) : (
            <Link to="/login">Sign in</Link>
          )}
        </nav>
      </header>

      {isSuccessOpen && (
        <Alert
          status="success"
          variant="subtle"
          display="flex"
          flexDirection="row"
          gap="10px"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="80px"
          colorScheme="red"
          borderRadius="10px"
          fontSize="small"
          className="alert-box"
        >
          <AlertIcon color={"#6dcaae"} boxSize="30px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {successMessage}
          </AlertTitle>
        </Alert>
      )}
    </div>
  );
}
