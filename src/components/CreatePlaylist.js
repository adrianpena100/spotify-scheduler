import React, { useState } from "react"; // Import React and useState hook

export default function CreatePlaylist({ spotifyApi, refreshPlaylists }) {
  const [playlistName, setPlaylistName] = useState(""); // State to hold the playlist name

  const handleCreatePlaylist = (e) => {
    e.preventDefault(); // Prevent default form submission

    const finalPlaylistName = playlistName.trim() + " - PARTY"; // Append " - PARTY" to the playlist name

    // Create playlist on Spotify
    spotifyApi
      .createPlaylist(finalPlaylistName, {
        description: "Party Playlist", // Set playlist description
        public: true, // Make the playlist public
      })
      .then(function (data) {
        alert(`Playlist "${finalPlaylistName}" created successfully!`); // Show success alert
        setPlaylistName(""); // Clear input after creation

        // Refresh playlists to update the list with the new one
        refreshPlaylists(); // Call the function passed from Dashboard.js to refresh playlists
      })
      .catch(function (err) {
        console.error("Something went wrong!", err); // Log error if playlist creation fails
      });
  };

  return (
    <div>
      <h3>Create a Party Playlist</h3>
      <form onSubmit={handleCreatePlaylist}>
        <input
          type="text"
          value={playlistName} // Bind input value to playlistName state
          onChange={(e) => setPlaylistName(e.target.value)} // Update state on input change
          placeholder="Enter playlist name" // Input placeholder text
          required // Make input required
        />
        <button type="submit">Create Playlist</button> {/* Submit button */}
      </form>
    </div>
  );
}
