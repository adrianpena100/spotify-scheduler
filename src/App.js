import React from 'react'; // Import React.
import './App.css'; // Import the CSS file for styling.
import PlaySongButton from './components/PlaySongButton'; // Import the PlaySongButton component.

function App() {
  return (
    <div className="App">
      <h1>Spotify Song Player</h1> {/* Header for the application */}
      <PlaySongButton /> {/* Render the PlaySongButton component */}
    </div>
  );
}

export default App; // Export the App component as the default export.
