import { FaPlay, FaMinusCircle } from 'react-icons/fa';  // Import minus icon

export default function DisplayPlaylists({ spotifyApi, partyPlaylists, onTrackSelect, selectedPlaylistId, setSelectedPlaylistId, refreshTracks, tracks }) {

  // Fetch tracks when a playlist is clicked
  const handlePlaylistClick = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    refreshTracks(playlistId);
  };

  // Function to remove "- PARTY" from playlist names
  const formatPlaylistName = (name) => {
    return name.replace(" - PARTY", "");
  };

  // Handle song removal from playlist
  const handleRemoveTrack = (trackUri) => {
    if (!selectedPlaylistId) return;

    spotifyApi.removeTracksFromPlaylist(selectedPlaylistId, [{ uri: trackUri }])
      .then(() => {
        refreshTracks(selectedPlaylistId);  // Refresh playlist after removing the track
      })
      .catch(err => {
        console.error("Error removing track:", err);
      });
  };

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Playlists Section */}
      <div style={{ maxHeight: '300px', overflowY: 'auto', width: '30%' }}>
        <h3>Your Party Playlists</h3>
        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
          {partyPlaylists.map((playlist) => (
            <li
              key={playlist.id}
              onClick={() => handlePlaylistClick(playlist.id)}
              style={{
                cursor: 'pointer',
                marginBottom: '15px',
                backgroundColor: selectedPlaylistId === playlist.id ? '#f0f0f0' : 'transparent',
                padding: '10px',
                borderRadius: '8px',
              }}
            >
              <div>{formatPlaylistName(playlist.name)}</div>
              <img 
                src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1BhBgvAdx2cQwiyvb-89VbGVzgQbB983tfw&s'}
                alt={playlist.name} 
                style={{ width: '100px', height: '100px', borderRadius: '8px' }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Tracks Section */}
      <div style={{ width: '70%', maxHeight: '300px', overflowY: 'auto' }}>
        {selectedPlaylistId ? (
          <>
            <h4>Tracks in Selected Playlist</h4>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
              {tracks.map((item) => (
                <li 
                  key={item.track.id} 
                  style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaPlay 
                      onClick={() => onTrackSelect({
                        title: item.track.name,
                        artist: item.track.artists[0].name,
                        uri: item.track.uri
                      })}
                      style={{ marginRight: '10px', cursor: 'pointer', color: 'green' }}
                    />
                    <div>
                      {item.track.name} - {item.track.artists[0].name}
                    </div>
                  </div>
                  <FaMinusCircle 
                    onClick={() => handleRemoveTrack(item.track.uri)}  // Handle track removal
                    style={{ cursor: 'pointer', color: 'red' }}
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
