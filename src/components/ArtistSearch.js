import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ArtistSearch.css'; // Import the CSS file

// Component for searching and displaying artist information
const ArtistSearch = () => {
  // State to store the search input entered by the user
  const [artistName, setArtistName] = useState("");
  // State to store the fetched artist's data
  const [artistData, setArtistData] = useState(null);

  // Function to handle form submission and search for the artist
  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent the form from refreshing the page on submit

    try {
      // Make a request to the backend to search for the artist by name
      const response = await axios.get(
        `http://localhost:3001/search/${artistName}`
      );
      setArtistData(response.data); // Store the artist's data in state
      console.log(artistData); // Log the artist data to the console for debugging
    } catch (error) {
      console.error("Error fetching artist data:", error); // Log any errors during the request
    }
  };

    return (
        <div className="artist-search-container">
            <h1>Spotify Artist Search</h1>
            {/* Form to capture the artist's name input */}
            <form onSubmit={handleSearch} className="artist-search-form">
                <input
                    type="text"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)} // Update the artistName state as the user types
                    placeholder="Enter artist name"
                    className="artist-search-input"
                />
                <button type="submit" className="artist-search-button">Search</button>
            </form>

            {/* Conditionally render the artist data if it exists */}
            {artistData && (
                <div className="artist-data-container">
                    <h2>{artistData.name}</h2>
                    {/* Display the artist's image if available */}
                    <img src={artistData.images[0]?.url} alt={artistData.name} className="artist-image"/>
                    <p>Genres: {artistData.genres.join(', ')}</p>
                    <p>Followers: {artistData.followers.total}</p>
                    <p>Popularity: {artistData.popularity}</p>
                </div>
            )}
        </div>
    );
};

export default ArtistSearch;