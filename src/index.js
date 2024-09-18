import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS for styling
import React from "react"; // Import React library
import ReactDOM from "react-dom/client"; // Import ReactDOM for rendering React components
import "./styles/index.css"; // Import custom CSS for the app
import App from "./App"; // Import the main App component
import reportWebVitals from "./reportWebVitals"; // Import reportWebVitals for performance measurement

const root = ReactDOM.createRoot(document.getElementById("root")); // Create a root element for rendering the React app
root.render(<App />); // Render the App component inside the root element

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); // Call reportWebVitals to measure performance
