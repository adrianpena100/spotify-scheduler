import React from 'react';
import { Container } from 'react-bootstrap';
import '../styles/Login.css';  // Import the CSS file

const AUTH_URL = "https://accounts.spotify.com/authorize?client_id=69fd466f76c84dc9b965ac235c3c97b7&response_type=code&redirect_uri=http://localhost:3000/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private";

export default function Login() {
  return (
    <Container className="login-container">
      <a className="login-button" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  );
}