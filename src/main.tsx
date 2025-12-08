import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import appConfig from "../app-config.json";

if (!(window as any).APP_CONFIG) {
  (window as any).APP_CONFIG = appConfig;
}

const root = document.getElementById("app");

if (!root) {
  throw new Error("Root element #app not found");
}

createRoot(root).render(<App />);
