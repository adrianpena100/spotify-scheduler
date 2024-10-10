import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import '../styles/Login.css';  // Import the CSS file

const clientId = "69fd466f76c84dc9b965ac235c3c97b7";
const redirectUri = "http://localhost:3000/callback";
const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-modify-public",
  "playlist-modify-private"
].join("%20");

let authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

// Check if the user has logged out or if it's their first time logging in
const loggedOut = localStorage.getItem('loggedOut');
if (!localStorage.getItem('accessToken') || loggedOut) {
  authUrl += "&show_dialog=true";  // Force login dialog only if logged out or first time
}

export default function Login() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store the message in local storage
    localStorage.setItem('loginMessage', message);
    console.log("Message sent to dashboard:", message);
    setMessage('');
  };

  return (
    <Container className="login-container">
      <a className="login-button" href={authUrl}>
        Login With Spotify
      </a>
      <form onSubmit={handleSubmit} style={{ display: 'inline-block', marginLeft: '10px' }}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type a message" 
        />
        <button type="submit">Send</button>
      </form>
    </Container>
  );
}
