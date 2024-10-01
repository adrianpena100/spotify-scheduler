import React, { useState } from 'react';
import '../styles/CreatePlaylist.css'; // Import the CSS file

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
    <div className="create-playlist-container">
      <h3>Create a Party Playlist</h3>
      <form onSubmit={handleCreatePlaylist} className="create-playlist-form">
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter playlist name"
          required
          className="create-playlist-input"
        />
        <button type="submit" className="create-playlist-button">Create Playlist</button>
      </form>
    </div>
  );
}