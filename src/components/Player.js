import { useState, useEffect } from "react";
import SpotifyPlayer from "react-spotify-web-playback"; 

export default function Player({ accessToken, trackUri, onNextTrack, onPreviousTrack, isPlaying, setIsPlaying }) {
  const [play, setPlay] = useState(false); 

  // Effect to start playback when trackUri changes
  useEffect(() => {
    if (trackUri) {
      setPlay(true); 
      setIsPlaying(true); // Ensure we are playing the track when it's selected
    }
  }, [trackUri]);

  if (!accessToken) return null; 

  return (
    <SpotifyPlayer
      token={accessToken} 
      showSaveIcon 
      callback={(state) => {
        if (!state.isPlaying) {
          setPlay(false); 
          setIsPlaying(false);
        } else {
          setIsPlaying(true);
        }

        // Automatically play the next track when the current one ends
        if (state.track && state.position === 0 && state.progressMs > 0 && state.progressMs < 1000) {
          onNextTrack(); 
        }
      }}
      play={play} 
      uris={trackUri ? [trackUri] : []} 
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
