
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  const container = document.getElementById("root");
  if (!container) {
    throw new Error("root element not found");
  }
  createRoot(container).render(<App />);
  