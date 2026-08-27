import { useEffect } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";

export default function App() {
  useEffect(() => {
    // Ensure tab title
    document.title = "Unlock Her Tech | Where Skills Grow And Voices Are Heard";
  }, []);

  return <RouterProvider router={router} />;
}