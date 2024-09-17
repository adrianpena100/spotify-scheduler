import React, { useState } from 'react';

export default function CreatePlaylist({ spotifyApi, refreshPlaylists }) {
  const [playlistName, setPlaylistName] = useState('');

  const handleCreatePlaylist = (e) => {
    e.preventDefault();

    const finalPlaylistName = playlistName.trim() + ' - PARTY';

    // Create playlist on Spotify
    spotifyApi.createPlaylist(finalPlaylistName, { 'description': 'Party Playlist', 'public': true })
      .then(function(data) {
        alert(`Playlist "${finalPlaylistName}" created successfully!`);
        setPlaylistName('');  // Clear input after creation

        // Refresh playlists to update the list with the new one
        refreshPlaylists();  // Call the function passed from Dashboard.js to refresh playlists
      })
      .catch(function(err) {
        console.error('Something went wrong!', err);
      });
  };

  return (
    <div>
      <h3>Create a Party Playlist</h3>
      <form onSubmit={handleCreatePlaylist}>
        <input
          type="text"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="Enter playlist name"
          required
        />
        <button type="submit">Create Playlist</button>
      </form>
    </div>
  );
}
