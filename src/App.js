import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "./styles/App.css"; // Import custom CSS
import Login from "./components/Login"; // Import Login component
import Dashboard from "./components/Dashboard"; // Import Dashboard component

// Extract the authorization code from the URL query parameters
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  // Check if an access token is stored in localStorage
  const storedAccessToken = localStorage.getItem('accessToken');

  // If no code or token is available, show the Login component
  if (!code && !storedAccessToken) {
    return <Login />;
  }

  // If we have the code, render the Dashboard with the code prop
  return <Dashboard code={code} />;
}

export default App; // Export the App component as the default export
