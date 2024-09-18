import React, { useState } from "react"; // Import React and useState for managing component state.
import axios from "axios"; // Import axios for making HTTP requests.

const PlaySongButton = () => {
  // useState hook to manage the state for the track data and any potential error.
  const [track, setTrack] = useState(null); // track holds the data for the current track.
  const [error, setError] = useState(null); // error holds any error messages related to the API call.

  // Function to handle the button click and make the API call to fetch the track.
  const handlePlaySong = () => {
    // Make a POST request to the server's /api/get-song endpoint.
    axios
      .post("http://localhost:3001/api/get-song", {
        uri: "58Q3FZFs1YXPpliWQB5kXB", // Only the track ID is passed in the request body.
      })
      .then((response) => {
        // If the API call is successful, update the track state with the data from the response.
        setTrack(response.data.track);
        // Log the track data to the console (for debugging purposes).
        console.log(response.data.track);
      })
      .catch((error) => {
        // If the API call fails, log the error and update the error state with a relevant message.
        console.error("Error fetching track:", error);
        setError("Error fetching track");
      });
  };

  return (
    <div>
      {/* Button that triggers the handlePlaySong function when clicked */}
      <button onClick={handlePlaySong}>Play Song</button>
      {/* Conditionally render the track information if a track is available */}
      {track && (
        <div>
          <h3>{track.name}</h3> {/* Display the name of the track */}
          <p>{track.artists[0].name}</p> {/* Display the artist of the track */}
        </div>
      )}
      {/* Conditionally render an error message if there is an error */}
      {error && <p>{error}</p>}
    </div>
  );
};

export default PlaySongButton; // Export the PlaySongButton component for use in other parts of the application.
