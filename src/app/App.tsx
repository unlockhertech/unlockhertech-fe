import {useEffect} from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import logoImage from "../assets/3b75a23b50c05dd92e772d611097d91604e0b5b1.png";

export default function App() {
  useEffect(() => {
    try {
      //set favicon
      const link: HTMLLinkElement =
          (document.querySelector('link[rel~="icon"]') as HTMLLinkElement) ||
          (() => {
            const link = document.createElement('link');
            link.rel = 'icon';
            document.getElementsByTagName('head')[0].appendChild(link);
            return link;
          })();
      link.type = 'image/png';
      link.href = logoImage;

      //Set tab title
      document.title = "Unlock Her Tech";
    } catch (err) {
      console.warn("App initialization warning:", err);
    }
  }, []);
  return <RouterProvider router={router} />;
}