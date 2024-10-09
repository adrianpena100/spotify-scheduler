// src/components/DisplayPlaylists.js

import { FaPlay, FaTrash, FaMinusCircle } from 'react-icons/fa';
import '../styles/DisplayPlaylists.css';

export default function DisplayPlaylists({ 
  spotifyApi, 
  partyPlaylists, 
  onTrackSelect, 
  selectedPlaylistId, 
  setSelectedPlaylistId, 
  refreshTracks, 
  tracks, 
  currentTrackIndex, 
  deletePlaylist 
}) {

  const handlePlaylistClick = (playlistId) => {
    if (selectedPlaylistId === playlistId) return; // Do nothing if the same playlist is clicked
    setSelectedPlaylistId(playlistId); 
    refreshTracks(playlistId);
  };

  const formatPlaylistName = (name) => {
    return name.replace(" - PARTY", ""); 
  };

  const handleRemoveTrack = (trackUri) => {
    if (!selectedPlaylistId) return;

    spotifyApi
      .removeTracksFromPlaylist(selectedPlaylistId, [{ uri: trackUri }])
      .then(() => {
        refreshTracks(selectedPlaylistId);
      })
      .catch((err) => console.error("Error removing track:", err));
  };

  const handlePlayClick = (e, track, index) => {
    e.stopPropagation(); // Prevent triggering the playlist click
    onTrackSelect(track, index);
  };

  return (
    <div className="display-playlists-container">
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
              <FaTrash 
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering playlist click
                  deletePlaylist(playlist.id);
                }} 
                className="trash-icon" 
                title="Delete playlist"
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="tracks-section">
        {selectedPlaylistId ? (
          <>
            <h4>Tracks in Selected Playlist</h4>
            <ul className="tracks-list">
              {tracks.map((item, index) => (
                <li 
                  key={item.track.id} 
                  className={`track-item ${currentTrackIndex === index ? 'playing' : ''}`}
                >
                  <FaPlay 
                    className="play-icon"
                    title="Play Track"
                    onClick={(e) => handlePlayClick(e, {
                      title: item.track.name,
                      artist: item.track.artists[0].name,
                      uri: item.track.uri
                    }, index)}
                  />
                  <div className="track-info">
                    {item.track.name} - {item.track.artists[0].name}
                  </div>
                  <FaMinusCircle 
                    onClick={() => handleRemoveTrack(item.track.uri)} 
                    className="remove-icon"
                    title="Remove track"
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <h4>Select a Playlist to View Tracks</h4>
        )}
      </div>
    </div>
  );
}
