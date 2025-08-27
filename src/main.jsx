import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import WheelExcluded from "./WheelExcluded.jsx";
import Snowfall from "react-snowfall";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <div className="min-h-screen bg-gradient-to-b from-[#f7f8f6] to-[#eef6ec] flex items-center justify-center p-5 relative">
      <Snowfall snowflakeCount={100} speed={[0.5, 1.5]} wind={[-0.5, 0.5]} />
      <WheelExcluded />
    </div>
  </StrictMode>
);
