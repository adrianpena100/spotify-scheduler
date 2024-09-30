import React, { useState } from "react";
import '../styles/TrackSearchResult.css';  // Import the CSS file

export default function TrackSearchResult({
  track,
  chooseTrack,
  partyPlaylists,
  spotifyApi,
  refreshPlaylists,
  refreshTracks,
  selectedPlaylistId,
}) {
  const [selectedPlaylist, setSelectedPlaylist] = useState(""); // State to hold the selected playlist ID

  // Function to remove "- PARTY" from playlist names
  const formatPlaylistName = (name) => {
    return name.replace(" - PARTY", ""); // Remove " - PARTY" suffix from playlist name
  };

  // Handle adding track to the selected playlist
  const handleAddToPlaylist = () => {
    if (!selectedPlaylist) return;
    spotifyApi
      .addTracksToPlaylist(selectedPlaylist, [track.uri]) // Add track to the selected playlist
      .then(() => {
        alert(`Added ${track.title} to the playlist!`); // Show success alert
        refreshPlaylists(); // Trigger playlist refresh after adding a track
        if (selectedPlaylist === selectedPlaylistId) {
          refreshTracks(selectedPlaylistId); // Refresh tracks for the current playlist
        }
      })
      .catch((err) => {
        console.error("Error adding track to playlist:", err); // Log error if adding track fails
      });
  };

  return (
    <div className="track-search-result">
      <div className="track-details" onClick={() => chooseTrack(track)}>
        <img src={track.albumUrl} alt={track.title} />
        <div className="track-info">
          <div>{track.title}</div>
          <div className="track-artist">{track.artist}</div>
        </div>
      </div>

      <div className="add-button">
        {/* Dropdown to select which PARTY playlist to add to */}
        <select
          value={selectedPlaylist}
          onChange={e => setSelectedPlaylist(e.target.value)}
          className="playlist-select"
        >
          <option value="">Select Playlist</option>
          {partyPlaylists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {formatPlaylistName(playlist.name)}
            </option>
          ))}
        </select>
        <button onClick={handleAddToPlaylist} disabled={!selectedPlaylist}>
          Add to Playlist
        </button>
      </div>
    </div>
  );
}