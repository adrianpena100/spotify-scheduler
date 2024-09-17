import React, { useState } from "react"; // Import React and useState hook

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
    <div
      className="d-flex align-items-center justify-content-between m-2"
      style={{ cursor: "pointer" }}
    >
      <div
        className="d-flex align-items-center"
        onClick={() => chooseTrack(track)} // Handle track selection
      >
        <img
          src={track.albumUrl}
          style={{ height: "64px", width: "64px" }}
          alt={track.title}
        />
        <div className="ml-3">
          <div>{track.title}</div>
          <div className="text-muted">{track.artist}</div>
        </div>
      </div>

      <div className="ml-auto">
        {/* Dropdown to select which PARTY playlist to add to */}
        <select
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)} // Update selected playlist state on change
          style={{ marginRight: "10px" }} // Adding margin-right for spacing
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
