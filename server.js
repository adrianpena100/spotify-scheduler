require('dotenv').config(); // Load environment variables from a .env file
const express = require('express'); // Import Express framework for building the server
const axios = require('axios'); // Import Axios for making HTTP requests
const cors = require('cors'); // Import the CORS middleware
const app = express(); // Create an instance of Express
const PORT = process.env.PORT || 3001; // Set the port for the server, defaulting to 3001 if not specified

app.use(cors()); // Enable CORS for all routes to allow cross-origin requests

// Function to get an access token from Spotify
const getAccessToken = async () => {
    // Retrieve the client ID and client secret from environment variables
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

    // Define the options for the Axios request to get the access token
    const authOptions = {
        url: 'https://accounts.spotify.com/api/token', // Spotify's token endpoint
        headers: {
            // Authorization header requires a base64 encoded string of client_id:client_secret
            'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded' // Specify the content type
        },
        data: 'grant_type=client_credentials', // Grant type needed for client credentials flow
        method: 'POST' // Use POST method to request the token
    };

    try {
        // Send the POST request to Spotify to get the access token
        const response = await axios(authOptions);
        return response.data.access_token; // Return the access token from the response
    } catch (error) {
        console.error('Error getting access token:', error); // Log any errors during the request
        throw new Error('Failed to retrieve access token'); // Throw an error if the request fails
    }
};

// Define a new endpoint to get artist data using their Spotify ID
app.get('/artist/:id', async (req, res) => {
    const artistId = req.params.id; // Extract the artist ID from the request parameters

    try {
        const token = await getAccessToken(); // Automatically fetch the access token

        // Define the options for the Axios request to get artist data
        const options = {
            url: `https://api.spotify.com/v1/artists/${artistId}`, // Spotify's artist endpoint with the artist ID
            headers: {
                'Authorization': `Bearer ${token}` // Use the fetched access token in the Authorization header
            },
            method: 'GET' // Use GET method to retrieve artist data
        };

        const response = await axios(options); // Send the GET request to Spotify to get the artist data
        res.json(response.data); // Send the artist data as a JSON response to the client
    } catch (error) {
        console.error('Error getting artist data:', error); // Log any errors during the request
        res.status(500).send('Error getting artist data'); // Send a 500 error response if the request fails
    }
});

// Define a new endpoint to search for an artist by name
app.get('/search/:name', async (req, res) => {
    const artistName = req.params.name; // Extract the artist name from the request parameters

    try {
        const token = await getAccessToken(); // Automatically fetch the access token

        // Use the search endpoint to find the artist by name
        const searchOptions = {
            url: `https://api.spotify.com/v1/search`, // Spotify's search endpoint
            headers: {
                'Authorization': `Bearer ${token}` // Use the fetched access token in the Authorization header
            },
            params: {
                q: artistName, // Query parameter for the artist name
                type: 'artist', // Specify that we are searching for an artist
                limit: 1 // Get only the top result
            }
        };

        const searchResponse = await axios(searchOptions); // Send the GET request to Spotify to search for the artist
        const artist = searchResponse.data.artists.items[0]; // Get the first artist result

        if (artist) {
            console.log(artist); // Log the artist data to the server console for debugging
            res.json(artist); // Send the artist data back to the client as a JSON response
        } else {
            res.status(404).send('Artist not found'); // Send a 404 response if no artist is found
        }
    } catch (error) {
        console.error('Error searching for artist:', error); // Log any errors during the request
        res.status(500).send('Error searching for artist'); // Send a 500 error response if the request fails
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log that the server is running
});
