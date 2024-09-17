import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React
import axios from "axios"; // Import axios for making HTTP requests

export default function useAuth(code) {
  const [accessToken, setAccessToken] = useState(); // State to hold the access token
  const [refreshToken, setRefreshToken] = useState(); // State to hold the refresh token
  const [expiresIn, setExpiresIn] = useState(); // State to hold the token expiration time

  // Effect to handle the initial authorization code exchange
  useEffect(() => {
    axios
      .post("http://localhost:3001/login", {
        code, // Send the authorization code to the server
      })
      .then((res) => {
        setAccessToken(res.data.accessToken); // Set the access token from the response
        setRefreshToken(res.data.refreshToken); // Set the refresh token from the response
        setExpiresIn(res.data.expiresIn); // Set the token expiration time from the response
        window.history.pushState({}, null, "/"); // Remove the authorization code from the URL
      })
      .catch(() => {
        window.location = "/"; // Redirect to the home page if the request fails
      });
  }, [code]);

  // Effect to handle token refresh before expiration
  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    const interval = setInterval(() => {
      axios
        .post("http://localhost:3001/refresh", {
          refreshToken, // Send the refresh token to the server
        })
        .then((res) => {
          setAccessToken(res.data.accessToken); // Update the access token from the response
          setExpiresIn(res.data.expiresIn); // Update the token expiration time from the response
        })
        .catch(() => {
          window.location = "/"; // Redirect to the home page if the request fails
        });
    }, (expiresIn - 60) * 1000); // Refresh the token 1 minute before it expires

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, [refreshToken, expiresIn]);

  return accessToken; // Return the access token
}
