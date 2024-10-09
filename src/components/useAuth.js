// src/components/useAuth.js

import { useState, useEffect } from "react";
import axios from "axios";

export default function useAuth(code) {
  // Initialize state variables to hold tokens and expiration time, 
  // retrieving them from localStorage if they exist
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null); 
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [expiresAt, setExpiresAt] = useState(localStorage.getItem('expiresAt') ? parseInt(localStorage.getItem('expiresAt')) : null);

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
        const expiresIn = res.data.expiresIn;
        const calculatedExpiresAt = Date.now() + expiresIn * 1000;
        setExpiresAt(calculatedExpiresAt);

        // Store the tokens and expiration time in localStorage for persistence
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        localStorage.setItem('expiresAt', calculatedExpiresAt.toString());

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
    if (!refreshToken || !expiresAt) return; // Skip if refreshToken or expiresAt is missing

    const refreshInterval = expiresAt - Date.now() - 60000; // 1 minute before expiration

    if (refreshInterval <= 0) {
      // Token already expired or about to expire, refresh immediately
      refreshAccessToken();
    } else {
      const timeout = setTimeout(() => {
        refreshAccessToken();
      }, refreshInterval);

      // Cleanup the timeout when the component unmounts or dependencies change
      return () => clearTimeout(timeout);
    }

    function refreshAccessToken() {
      axios
        .post("http://localhost:3001/refresh", { refreshToken }) // Send refresh token to backend
        .then((res) => {
          // Update the access token and expiration time
          setAccessToken(res.data.accessToken);
          const newExpiresAt = Date.now() + res.data.expiresIn * 1000;
          setExpiresAt(newExpiresAt);

          // Also store the new token and expiration in localStorage
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('expiresAt', newExpiresAt.toString());
        })
        .catch(() => {
          window.location = "/"; // Redirect to login if token refresh fails
        });
    }

  }, [refreshToken, expiresAt]); // Only run when refreshToken or expiresAt changes

  // Return the access token to be used by other components
  return accessToken;
}
