// src/components/Player.js

import SpotifyPlayer from "react-spotify-web-playback"; 

export default function Player({ 
  accessToken, 
  trackUris, 
  index, 
  onNextTrack, 
  onPreviousTrack, 
  isPlaying, 
  setIsPlaying,
  onTrackChange // New prop to handle track changes
}) {
  if (!accessToken) return null; 

  return (
    <SpotifyPlayer
      token={accessToken} 
      showSaveIcon 
      callback={(state) => {
        if (!state.isPlaying) {
          setIsPlaying(false);
        } else {
          setIsPlaying(true);
        }

        // Detect track changes initiated by the web SDK (next/previous)
        if (state.track && state.track.uri !== (trackUris[index] || '')) {
          onTrackChange(state.track.uri);
        }

        // Automatically play the next track when the current one ends
        if (state.track && state.position === 0 && state.progressMs > 0 && state.progressMs < 1000) {
          onNextTrack(); 
        }
      }}
      play={isPlaying} 
      uris={trackUris.length > 0 ? trackUris : []} 
      index={index !== null ? index : 0} // Default to first track if index is null
      styles={{
        activeColor: '#1DB954',
        bgColor: '#333',
        color: '#fff',
        loaderColor: '#fff',
        sliderColor: '#1DB954',
        trackArtistColor: '#ccc',
        trackNameColor: '#fff',
      }}
    />
  );
}
