import React from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";
import "./index.css";
import "./ui/ui.css";
import "./views/immersive-experience.css";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
