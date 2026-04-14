import { createBrowserRouter } from "react-router";
import { Layout }       from "./components/Layout";
import { HomePage }     from "./pages/HomePage";
import { EpisodesPage } from "./pages/EpisodesPage";
import { AboutPage }    from "./pages/AboutPage";
import { TeamPage }     from "./pages/TeamPage";
import { CookiePolicy } from "./pages/CookiePolicy";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,       Component: HomePage     },
      { path: "episodes",  Component: EpisodesPage },
      { path: "about",     Component: AboutPage    },
      { path: "team",      Component: TeamPage     },
      { path: "cookie-policy", Component: CookiePolicy },
    ],
  },
]);
