import { render, screen } from "@testing-library/react"; // Import render and screen utilities from React Testing Library
import App from "../App"; // Import the App component

test("renders learn react link", () => {
  render(<App />); // Render the App component
  const linkElement = screen.getByText(/learn react/i); // Find an element with text matching "learn react" (case-insensitive)
  expect(linkElement).toBeInTheDocument(); // Assert that the element is in the document
});