import { useState, useEffect, useCallback } from "react"; // Add useCallback import
import useAuth from "./useAuth"; // Import custom hook for authentication
import Player from "./Player"; // Import Player component
import TrackSearchResult from "./TrackSearchResult"; // Import TrackSearchResult component
import { Container, Form } from "react-bootstrap"; // Import Bootstrap components
import SpotifyWebApi from "spotify-web-api-node"; // Import Spotify Web API library
import axios from "axios"; // Import axios for HTTP requests
import CreatePlaylist from "./CreatePlaylist"; // Import CreatePlaylist component
import DisplayPlaylists from "./DisplayPlaylists"; // Import DisplayPlaylists component

// Initialize Spotify API with client ID
const spotifyApi = new SpotifyWebApi({
  clientId: "69fd466f76c84dc9b965ac235c3c97b7",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code); // Get access token using custom hook
  const [search, setSearch] = useState(""); // State to hold search query
  const [searchResults, setSearchResults] = useState([]); // State to hold search results
  const [playingTrack, setPlayingTrack] = useState(); // State to hold currently playing track
  const [lyrics, setLyrics] = useState(""); // State to hold lyrics of the playing track
  const [partyPlaylists, setPartyPlaylists] = useState([]); // State to hold party playlists
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null); // State to hold selected playlist ID
  const [tracks, setTracks] = useState([]); // State to hold tracks of the selected playlist

  // Function to choose a track to play
  function chooseTrack(track) {
    setPlayingTrack(track); // Set the playing track
    setSearch(""); // Clear the search query
    setLyrics(""); // Clear the lyrics
  }

  // Wrap refreshPlaylists with useCallback to prevent unnecessary re-renders
  const refreshPlaylists = useCallback(() => {
    if (!accessToken) return;
    spotifyApi
      .getUserPlaylists() // Fetch user playlists from Spotify
      .then((data) => {
        const playlists = data.body.items;
        const filteredPlaylists = playlists.filter((playlist) =>
          playlist.name.endsWith(" - PARTY")
        );
        setPartyPlaylists(filteredPlaylists); // Set party playlists
      })
      .catch((err) => {
        console.error("Something went wrong!", err); // Log error if fetching playlists fails
      });
  }, [accessToken]);

  // Function to refresh tracks of the selected playlist
  const refreshTracks = (playlistId) => {
    if (!playlistId) return;
    spotifyApi
      .getPlaylistTracks(playlistId) // Fetch tracks of the selected playlist
      .then((res) => {
        setTracks(res.body.items); // Set tracks
      })
      .catch((err) => {
        console.error("Error fetching playlist tracks:", err); // Log error if fetching tracks fails
      });
  };

  // Effect to set access token and refresh playlists when accessToken changes
  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken); // Set access token for Spotify API
    refreshPlaylists(); // Refresh playlists
  }, [accessToken, refreshPlaylists]);

  // Effect to fetch lyrics for the currently playing track
  useEffect(() => {
    if (!playingTrack) return;
    axios
      .get("http://localhost:3001/lyrics", {
        params: {
          track: playingTrack.title,
          artist: playingTrack.artist,
        },
      })
      .then((res) => {
        setLyrics(res.data.lyrics || "No Lyrics Found"); // Set lyrics
      })
      .catch((err) => {
        setLyrics("Error fetching lyrics"); // Set error message if fetching lyrics fails
      });
  }, [playingTrack]);

  // Effect to search for tracks
  useEffect(() => {
    if (!search) return setSearchResults([]); // Clear search results if search query is empty
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => {
              if (image.height < smallest.height) return image;
              return smallest;
            },
            track.album.images[0]
          );

          return {
            artist: track.artists[0].name,
            title: track.name,
            uri: track.uri,
            albumUrl: smallestAlbumImage.url,
          };
        })
      );
    });

    return () => (cancel = true); // Cancel the search if the component unmounts
  }, [search, accessToken]);

  return (
    <Container
      className="d-flex flex-column py-2"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <CreatePlaylist
        spotifyApi={spotifyApi}
        refreshPlaylists={refreshPlaylists} // Pass refreshPlaylists function to CreatePlaylist component
      />

      <DisplayPlaylists
        partyPlaylists={partyPlaylists} // Pass party playlists to DisplayPlaylists component
        spotifyApi={spotifyApi}
        accessToken={accessToken}
        onTrackSelect={chooseTrack} // Pass chooseTrack function to DisplayPlaylists component
        selectedPlaylistId={selectedPlaylistId}
        setSelectedPlaylistId={setSelectedPlaylistId}
        refreshTracks={refreshTracks} // Pass refreshTracks function to DisplayPlaylists component
        tracks={tracks}
      />

      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search} // Bind input value to search state
        onChange={(e) => setSearch(e.target.value)} // Update search state on input change
        className="mt-3"
      />

      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map((track) => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack} // Pass chooseTrack function to TrackSearchResult component
            partyPlaylists={partyPlaylists} // Pass party playlists to TrackSearchResult component
            spotifyApi={spotifyApi}
            refreshPlaylists={refreshPlaylists} // Pass refreshPlaylists function to TrackSearchResult component
            refreshTracks={refreshTracks} // Pass refreshTracks function to TrackSearchResult component
            selectedPlaylistId={selectedPlaylistId}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics} {/* Display lyrics if no search results */}
          </div>
        )}
      </div>

      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />{" "}
        {/* Pass accessToken and trackUri to Player component */}
      </div>
    </Container>
  );
}
