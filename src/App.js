import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling
import "./styles/App.css"; // Import custom CSS for the app
import Login from "./components/Login"; // Import Login component
import Dashboard from "./components/Dashboard"; // Import Dashboard component

// Extract the authorization code from the URL query parameters
const code = new URLSearchParams(window.location.search).get("code");

function App() {
  // If the authorization code is present, render the Dashboard component with the code as a prop
  // Otherwise, render the Login component
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App; // Export the App component as the default export
