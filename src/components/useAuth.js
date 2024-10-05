import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  // Initialize state variables to hold tokens and expiration time, 
  // retrieving them from localStorage if they exist
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken')); 
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem('expiresIn'));

  // useEffect to exchange the authorization code for access and refresh tokens
  // This only runs if a code is provided and no access token exists yet
  useEffect(() => {
    if (!code || accessToken) return; // Skip if already authenticated

    // Make a request to the server to exchange the code for tokens
    axios
      .post("http://localhost:3001/login", { code }) // Send authorization code to the backend
      .then((res) => {
        // Store tokens in state variables
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        setExpiresIn(res.data.expiresIn);

        // Store the tokens and expiration time in localStorage for persistence
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('expiresIn', res.data.expiresIn);

        // Clear the 'loggedOut' flag since the user has logged in successfully
        localStorage.removeItem('loggedOut');

        // Clean the URL to remove the authorization code (it’s no longer needed)
        window.history.pushState({}, null, "/");
      })
      .catch(() => {
        window.location = "/"; // If something goes wrong, redirect to login
      });
  }, [code, accessToken]); // Only run when code or accessToken changes

  // useEffect to refresh the access token automatically before it expires
  useEffect(() => {
    if (!refreshToken || !expiresIn) return; // Skip if refreshToken or expiresIn is missing

    // Set an interval to refresh the token 1 minute before expiration
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", { refreshToken }) // Send refresh token to backend
        .then((res) => {
          // Update the access token and expiration time
          setAccessToken(res.data.accessToken);
          setExpiresIn(res.data.expiresIn);

          // Also store the new token and expiration in localStorage
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('expiresIn', res.data.expiresIn);
        })
        .catch(() => {
          window.location = "/"; // Redirect to login if token refresh fails
        });
    }, (expiresIn - 60) * 1000); // Set the interval to run 1 minute before expiration

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]); // Only run when refreshToken or expiresIn changes

  // Return the access token to be used by other components
  return accessToken;
}
