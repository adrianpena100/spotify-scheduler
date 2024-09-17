import { useState, useEffect, useCallback } from "react";  // Add useCallback import
import useAuth from "./useAuth";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import CreatePlaylist from './CreatePlaylist';
import DisplayPlaylists from './DisplayPlaylists';

const spotifyApi = new SpotifyWebApi({
  clientId: "69fd466f76c84dc9b965ac235c3c97b7",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState();
  const [lyrics, setLyrics] = useState("");
  const [partyPlaylists, setPartyPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [tracks, setTracks] = useState([]);

  function chooseTrack(track) {
    setPlayingTrack(track);
    setSearch("");
    setLyrics("");
  }

  // Wrap refreshPlaylists with useCallback to prevent unnecessary re-renders
  const refreshPlaylists = useCallback(() => {
    if (!accessToken) return;
    spotifyApi.getUserPlaylists()
      .then(data => {
        const playlists = data.body.items;
        const filteredPlaylists = playlists.filter(playlist => playlist.name.endsWith(" - PARTY"));
        setPartyPlaylists(filteredPlaylists);
      })
      .catch(err => {
        console.error('Something went wrong!', err);
      });
  }, [accessToken]);

  const refreshTracks = (playlistId) => {
    if (!playlistId) return;
    spotifyApi.getPlaylistTracks(playlistId)
      .then(res => {
        setTracks(res.body.items);
      })
      .catch(err => {
        console.error('Error fetching playlist tracks:', err);
      });
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    refreshPlaylists();  // This now won't cause a warning
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
      .then(res => {
        setLyrics(res.data.lyrics || "No Lyrics Found");
      })
      .catch(err => {
        setLyrics("Error fetching lyrics");
      });
  }, [playingTrack]);

  // Effect to search for tracks
  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then(res => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map(track => {
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

    return () => (cancel = true);
  }, [search, accessToken]);

  return (
    <Container className="d-flex flex-column py-2" style={{ height: "100vh", overflowY: "auto" }}>
      <CreatePlaylist spotifyApi={spotifyApi} refreshPlaylists={refreshPlaylists} />

      <DisplayPlaylists
        partyPlaylists={partyPlaylists}
        spotifyApi={spotifyApi}
        accessToken={accessToken}
        onTrackSelect={chooseTrack}
        selectedPlaylistId={selectedPlaylistId}
        setSelectedPlaylistId={setSelectedPlaylistId}
        refreshTracks={refreshTracks}
        tracks={tracks}
      />

      <Form.Control
        type="search"
        placeholder="Search Songs/Artists"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mt-3"
      />

      <div className="flex-grow-1 my-2" style={{ overflowY: "auto" }}>
        {searchResults.map(track => (
          <TrackSearchResult
            track={track}
            key={track.uri}
            chooseTrack={chooseTrack}
            partyPlaylists={partyPlaylists}
            spotifyApi={spotifyApi}
            refreshPlaylists={refreshPlaylists}  // Passing the refreshPlaylists function
            refreshTracks={refreshTracks}        // Passing refreshTracks for the current playlist update
            selectedPlaylistId={selectedPlaylistId}
          />
        ))}
        {searchResults.length === 0 && (
          <div className="text-center" style={{ whiteSpace: "pre" }}>
            {lyrics}
          </div>
        )}
      </div>

      <div>
        <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
      </div>
    </Container>
  );
}
