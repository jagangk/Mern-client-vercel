import React, { useContext, useEffect, useState } from "react";
import { Navigate } from 'react-router-dom';
import { UserContext } from './userContext';

// Function to get JWT token from cookies
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const ProtectedRoute = ({ children }) => {
  const {  setUserInfo } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token') || getCookie('token');
    if (token) {
      const url = `${process.env.REACT_APP_API_URL}/profile`;
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
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [setUserInfo]);

  if (isLoading) {
    return <div>Loading...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoute;
