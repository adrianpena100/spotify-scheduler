import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React
import SpotifyPlayer from "react-spotify-web-playback"; // Import SpotifyPlayer component

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false); // State to control playback

  // Effect to start playback when trackUri changes
  useEffect(() => setPlay(true), [trackUri]);

  if (!accessToken) return null; // Return null if no access token is provided

  return (
    <SpotifyPlayer
      token={accessToken} // Spotify access token
      showSaveIcon // Show save icon on the player
      callback={(state) => {
        if (!state.isPlaying) setPlay(false); // Update play state when playback stops
      }}
      play={play} // Control playback state
      uris={trackUri ? [trackUri] : []} // Track URI to play
    />
  );
}
