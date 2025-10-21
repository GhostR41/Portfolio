import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { validateEnvironment } from "./lib/env-validator";

// SECURITY: Validate environment variables before starting app
validateEnvironment();

createRoot(document.getElementById("root")!).render(<App />);
