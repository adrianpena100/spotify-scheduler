import React from "react";
import { Container } from "react-bootstrap"; // Import Bootstrap Container component

// Spotify authorization URL with required scopes and redirect URI
const AUTH_URL =
  "https://accounts.spotify.com/authorize?client_id=69fd466f76c84dc9b965ac235c3c97b7&response_type=code&redirect_uri=http://localhost:3000/callback&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state%20playlist-modify-public%20playlist-modify-private";

export default function Login() {
  return (
    <Container
      className="d-flex justify-content-center align-items-center" // Center content horizontally and vertically
      style={{ minHeight: "100vh" }} // Set minimum height to full viewport height
    >
      <a className="btn btn-success btn-lg" href={AUTH_URL}>
        Login With Spotify
      </a>
    </Container>
  );
}
