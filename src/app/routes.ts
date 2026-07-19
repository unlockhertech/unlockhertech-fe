import { createBrowserRouter } from "react-router";
import { Layout }       from "./components/Layout";
import { HomePage }     from "./pages/HomePage";
import { EpisodesPage } from "./pages/EpisodesPage";
import { AboutPage }    from "./pages/AboutPage";
import { TeamPage }     from "./pages/TeamPage";
import { CookiePolicy } from "./pages/CookiePolicy";
import { BlogPostPage } from "./pages/BlogPostPage";
import { BlogIndexPage } from "./pages/BlogIndexPage";
import { EventsPage } from "./pages/EventsPage";
import { RouteErrorFallback } from "./components/RouteErrorFallback";

const enableBlog = import.meta.env.VITE_ENABLE_BLOG === 'true';
const enableEvents = import.meta.env.VITE_ENABLE_EVENTS === 'true';

const blogRoutes = enableBlog ? [
  { path: "blog",          Component: BlogIndexPage },
  { path: "blog/:slug",    Component: BlogPostPage },
] : [];

const eventRoutes = enableEvents ? [
  { path: "events", Component: EventsPage },
] : [];

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: RouteErrorFallback,
    children: [
      { index: true,       Component: HomePage     },
      { path: "episodes",  Component: EpisodesPage },
      { path: "about",     Component: AboutPage    },
      { path: "team",      Component: TeamPage     },
      { path: "cookie-policy", Component: CookiePolicy },
      {
        path: "admin",
        Component: () => {
          window.location.assign("/admin/index.html");
          return null;
        },
      },
      ...eventRoutes,
      ...blogRoutes,
    ],
  },
]);
