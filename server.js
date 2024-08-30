const express = require('express'); // Import the Express framework.
const cors = require('cors'); // Import CORS to handle cross-origin requests.
const SpotifyWebApi = require('spotify-web-api-node'); // Import the Spotify Web API Node library.
require('dotenv').config(); // Load environment variables from a .env file.

const app = express(); // Create an instance of an Express application.
app.use(cors()); // Enable CORS for all routes in the application.
app.use(express.json()); // Parse incoming JSON requests.

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID, // Your Spotify API client ID from the .env file.
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET, // Your Spotify API client secret from the .env file.
  redirectUri: process.env.SPOTIFY_REDIRECT_URI, // Your Spotify API redirect URI from the .env file.
});

// Route to handle fetching a track by its URI
app.post('/api/get-song', (req, res) => {
  const { uri } = req.body; // Extract the track URI from the request body.

  // Get an access token using the client credentials grant type.
  spotifyApi.clientCredentialsGrant().then(data => {
    // Set the access token on the API object to use in subsequent requests.
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the Spotify API to get information about the track by its ID.
    spotifyApi.getTrack(uri)
      .then(trackData => {
        // Send the track data back to the client as a JSON response.
        res.json({ track: trackData.body });
      })
      .catch(err => {
        // If there's an error fetching the track, log the error and send a 500 response.
        console.error('Error fetching track:', err);
        res.status(500).send('Error fetching track');
      });
  }).catch(err => {
    // If there's an error retrieving the access token, log the error and send a 500 response.
    console.error('Error retrieving access token:', err);
    res.status(500).send('Error retrieving access token');
  });
});

const PORT = process.env.PORT || 3001; // Set the port to the value in the .env file or default to 3001.
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // Start the server and log the port it's running on.
