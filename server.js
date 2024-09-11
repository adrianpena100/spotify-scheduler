require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")
const Genius = require("genius-lyrics-api") // Import the Genius API library

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(400)
    })
})

app.post("/login", (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
      res.sendStatus(400)
    })
})

// Modify the lyrics endpoint to use Genius API
app.get("/lyrics", async (req, res) => {
  const { artist, track } = req.query;
  
  console.log("Received request for lyrics with the following data:");
  console.log("Artist:", artist);
  console.log("Track:", track);

  const options = {
    apiKey: process.env.GENIUS_API_KEY, // Genius API key from .env
    title: track,
    artist: artist,
    optimizeQuery: true
  };

  try {
    const lyrics = await Genius.getLyrics(options); // Fetch lyrics from Genius API

    if (!lyrics) {
      console.log("No Lyrics Found");
      res.json({ lyrics: "No Lyrics Found" });
    } else {
      console.log("Lyrics found:", lyrics);
      res.json({ lyrics });
    }
  } catch (error) {
    console.error("Error fetching lyrics:", error);
    res.status(500).json({ lyrics: "Error fetching lyrics" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
