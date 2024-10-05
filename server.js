require("dotenv").config(); // Load environment variables from .env file
const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware
const bodyParser = require("body-parser"); // Import body-parser middleware
const SpotifyWebApi = require("spotify-web-api-node"); // Import Spotify Web API library
const Genius = require("genius-lyrics-api"); // Import the Genius API library

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Endpoint to refresh Spotify access token
// Backend logic to handle token refreshing
app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken;
  
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  axios
    .post('https://accounts.spotify.com/api/token', {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: YOUR_CLIENT_ID,
      client_secret: YOUR_CLIENT_SECRET,
    })
    .then(response => {
      res.json({
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in
      });
    })
    .catch(() => {
      res.sendStatus(401);
    });
});


// Endpoint to log in to Spotify
app.post("/login", (req, res) => {
  const code = req.body.code; // Get authorization code from request body
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  // Exchange authorization code for access and refresh tokens
  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token, // Send access token
        refreshToken: data.body.refresh_token, // Send refresh token
        expiresIn: data.body.expires_in, // Send token expiration time
      });
    })
    .catch((err) => {
      res.sendStatus(400); // Send error status
    });
});

// Endpoint to get lyrics using Genius API
app.get("/lyrics", async (req, res) => {
  const { artist, track } = req.query; // Get artist and track from query parameters
  console.log("Received request for lyrics:", track, artist);

  const options = {
    apiKey: process.env.GENIUS_API_KEY, // Genius API key from environment variables
    title: track,
    artist: artist,
    optimizeQuery: true,
  };

  try {
    const lyrics = await Genius.getLyrics(options); // Fetch lyrics from Genius API
    if (!lyrics) {
      console.log("No Lyrics Found");
      res.json({ lyrics: "No Lyrics Found" }); // Send response if no lyrics found
    } else {
      console.log("Lyrics found:", lyrics);
      res.json({ lyrics }); // Send found lyrics
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error.message); // Log error details
    res.status(500).json({ lyrics: "Error fetching lyrics" }); // Send error response
  }
});

// Start the server on port 3001
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
