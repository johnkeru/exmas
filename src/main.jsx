import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import SpinnerWheel from "./SpinnerWheel.jsx";
import Race from "./Race.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    {/* <SpinnerWheel /> */}
    {/* <Race /> */}
  </StrictMode>
);
