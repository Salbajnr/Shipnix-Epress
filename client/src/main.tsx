import { createRoot } from "react-dom/client";
import App from "./App-debug";

console.log("main.tsx loading...");

const rootElement = document.getElementById("root");
if (!rootElement) {
  console.error("Root element not found!");
} else {
  console.log("Root element found, creating React root...");
  const root = createRoot(rootElement);
  console.log("Rendering App...");
  root.render(<App />);
  console.log("App render complete");
}
