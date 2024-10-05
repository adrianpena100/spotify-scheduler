import { useState, useEffect, useCallback } from "react";
import useAuth from "./useAuth";
import Player from "./Player";
import TrackSearchResult from "./TrackSearchResult";
import { Container, Form, Button, Navbar, Nav } from "react-bootstrap";
import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";
import CreatePlaylist from './CreatePlaylist';
import DisplayPlaylists from './DisplayPlaylists';
import '../styles/Dashboard.css';
import { ResizableBox } from 'react-resizable';

const spotifyApi = new SpotifyWebApi({
  clientId: "69fd466f76c84dc9b965ac235c3c97b7",
});

export default function Dashboard({ code }) {
  const accessToken = useAuth(code);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playingTrack, setPlayingTrack] = useState(null);
  const [lyrics, setLyrics] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const [partyPlaylists, setPartyPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('expiresIn');
      localStorage.setItem('loggedOut', 'true');
      window.location = '/';
    }
  };

  const chooseTrack = (track, index) => {
    if (playingTrack?.uri === track.uri) {
      setIsPlaying((prev) => !prev); 
    } else {
      setPlayingTrack(track); 
      setCurrentTrackIndex(index); 
      setSearch(""); 
      setLyrics(""); 
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (tracks.length === 0 || currentTrackIndex === null) return;
    const nextIndex = currentTrackIndex + 1;
    if (nextIndex < tracks.length) {
      const nextTrack = tracks[nextIndex]?.track;
      if (nextTrack) {
        chooseTrack({
          title: nextTrack.name,
          artist: nextTrack.artists[0].name,
          uri: nextTrack.uri,
        }, nextIndex);
      }
    } else {
      // Loop back to the first track
      chooseTrack(tracks[0].track, 0);
    }
  };

  const handlePreviousTrack = () => {
    if (tracks.length === 0 || currentTrackIndex === null) return;
    const prevIndex = currentTrackIndex - 1;
    if (prevIndex >= 0) {
      const prevTrack = tracks[prevIndex]?.track;
      if (prevTrack) {
        chooseTrack({
          title: prevTrack.name,
          artist: prevTrack.artists[0].name,
          uri: prevTrack.uri,
        }, prevIndex);
      }
    } else {
      // Loop back to the last track
      chooseTrack(tracks[tracks.length - 1].track, tracks.length - 1);
    }
  };

  const deletePlaylist = (playlistId) => {
    if (!accessToken) return;
    spotifyApi.unfollowPlaylist(playlistId)
      .then(() => {
        setPartyPlaylists(prevPlaylists => 
          prevPlaylists.filter(playlist => playlist.id !== playlistId)
        );
      })
      .catch((err) => console.error("Error deleting playlist:", err));
  };

  const refreshPlaylists = useCallback(() => {
    if (!accessToken) return;
    spotifyApi.getUserPlaylists()
      .then((data) => {
        const playlists = data.body.items.filter(playlist => playlist.name.endsWith(" - PARTY"));
        setPartyPlaylists(playlists);
      })
      .catch((err) => console.error("Something went wrong!", err));
  }, [accessToken]);

  const refreshTracks = (playlistId) => {
    if (!playlistId) return;
    spotifyApi.getPlaylistTracks(playlistId)
      .then((res) => {
        setTracks(res.body.items);
        setCurrentTrackIndex(null); // Reset track index when switching playlists
      })
      .catch((err) => console.error("Error fetching playlist tracks:", err));
  };

  useEffect(() => {
    if (!accessToken) return;
    spotifyApi.setAccessToken(accessToken);
    refreshPlaylists();
  }, [accessToken, refreshPlaylists]);

  useEffect(() => {
    if (!playingTrack) return;
    axios.get("http://localhost:3001/lyrics", {
      params: { track: playingTrack.title, artist: playingTrack.artist }
    })
      .then((res) => setLyrics(res.data.lyrics || "No Lyrics Found"))
      .catch(() => setLyrics("Error fetching lyrics"));
  }, [playingTrack]);

  useEffect(() => {
    if (!search) return setSearchResults([]);
    if (!accessToken) return;

    let cancel = false;
    spotifyApi.searchTracks(search).then((res) => {
      if (cancel) return;
      setSearchResults(
        res.body.tracks.items.map((track) => {
          const smallestAlbumImage = track.album.images.reduce(
            (smallest, image) => (image.height < smallest.height ? image : smallest),
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
    <Container className="dashboard-container d-flex flex-column py-2">
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Navbar.Brand href="#home">Spotify Scheduler</Navbar.Brand>
        <Nav className="ms-auto">
          <Button onClick={handleLogout} variant="outline-light">Logout</Button>
        </Nav>
      </Navbar>

      <CreatePlaylist spotifyApi={spotifyApi} refreshPlaylists={refreshPlaylists} />

      <DisplayPlaylists
        partyPlaylists={partyPlaylists}
        spotifyApi={spotifyApi}
        onTrackSelect={chooseTrack}
        selectedPlaylistId={selectedPlaylistId}
        setSelectedPlaylistId={setSelectedPlaylistId}
        refreshTracks={refreshTracks}
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        deletePlaylist={deletePlaylist}
      />

      <ResizableBox
        width={Infinity}
        height={300}
        minConstraints={[Infinity, 150]}
        maxConstraints={[Infinity, 600]}
        resizeHandles={['s']}
      >
        <>
          <Form.Control
            type="search"
            placeholder="Search Songs/Artists"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-control"
          />

          <div className="search-results">
            {searchResults.map(track => (
              <TrackSearchResult
                track={track}
                key={track.uri}
                chooseTrack={chooseTrack}
                partyPlaylists={partyPlaylists}
                spotifyApi={spotifyApi}
                refreshPlaylists={refreshPlaylists}
                refreshTracks={refreshTracks}
                selectedPlaylistId={selectedPlaylistId}
              />
            ))}
            {searchResults.length === 0 && <div className="no-lyrics centered-text">{lyrics}</div>}
          </div>
        </>
      </ResizableBox>

      <Player 
        accessToken={accessToken}
        trackUri={playingTrack?.uri}
        onNextTrack={handleNextTrack}
        onPreviousTrack={handlePreviousTrack}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
    </Container>
  );
}
