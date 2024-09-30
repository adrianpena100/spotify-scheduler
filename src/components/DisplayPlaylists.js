import { FaPlay, FaMinusCircle } from 'react-icons/fa';
import '../styles/DisplayPlaylists.css'; // Import the CSS file

export default function DisplayPlaylists({ 
  spotifyApi, 
  partyPlaylists, 
  onTrackSelect, 
  selectedPlaylistId, 
  setSelectedPlaylistId, 
  refreshTracks, 
  tracks 
}) {

  // Fetch tracks when a playlist is clicked
  const handlePlaylistClick = (playlistId) => {
    setSelectedPlaylistId(playlistId); // Set the selected playlist ID
    refreshTracks(playlistId); // Refresh tracks of the selected playlist
  };

  // Function to remove "- PARTY" from playlist names
  const formatPlaylistName = (name) => {
    return name.replace(" - PARTY", ""); // Remove " - PARTY" suffix from playlist name
  };

  // Handle song removal from playlist
  const handleRemoveTrack = (trackUri) => {
    if (!selectedPlaylistId) return;

    spotifyApi
      .removeTracksFromPlaylist(selectedPlaylistId, [{ uri: trackUri }]) // Remove track from playlist
      .then(() => {
        refreshTracks(selectedPlaylistId);
      })
      .catch((err) => {
        console.error("Error removing track:", err); // Log error if track removal fails
      });
  };

  return (
    <div className="display-playlists-container">
      {/* Playlists Section */}
      <div className="playlists-section">
        <h3>Your Party Playlists</h3>
        <ul className="playlists-list">
          {partyPlaylists.map((playlist) => (
            <li
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              className={`playlist-item ${selectedPlaylistId === playlist.id ? 'selected' : ''}`}
            >
              <div>{formatPlaylistName(playlist.name)}</div>
              <img 
                src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1BhBgvAdx2cQwiyvb-89VbGVzgQbB983tfw&s'}
                alt={playlist.name}
                className="playlist-image"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Tracks Section */}
      <div className="tracks-section">
        {selectedPlaylistId ? (
          <>
            <h4>Tracks in Selected Playlist</h4>
            <ul className="tracks-list">
              {tracks.map((item) => (
                <li key={item.track.id} className="track-item">
                  <div className="track-info">
                    <FaPlay 
                      onClick={() => onTrackSelect({
                        title: item.track.name,
                        artist: item.track.artists[0].name,
                        uri: item.track.uri
                      })}
                      className="play-icon"
                    />
                    <div>
                      {item.track.name} - {item.track.artists[0].name}
                    </div>
                  </div>
                  <FaMinusCircle 
                    onClick={() => handleRemoveTrack(item.track.uri)} 
                    className="remove-icon"
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h4>Select a Playlist to View Tracks</h4> // Prompt to select a playlist
        )}
      </div>
    </div>
  );
}