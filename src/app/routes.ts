import { createBrowserRouter } from "react-router";
import { Layout }       from "./components/Layout";
import { HomePage }     from "./pages/HomePage";
import { EpisodesPage } from "./pages/EpisodesPage";
import { AboutPage }    from "./pages/AboutPage";
import { TeamPage }     from "./pages/TeamPage";
import { CookiePolicy } from "./pages/CookiePolicy";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { BlogPostPage } from "./pages/BlogPostPage";
import { BlogIndexPage } from "./pages/BlogIndexPage";
import { EventsPage } from "./pages/EventsPage";
import { PracticesPage } from "./pages/PracticesPage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AssessmentPage } from "./pages/AssessmentPage";
import { CommunityGuidelinesPage } from "./pages/CommunityGuidelinesPage";
import { GetInvolvedPage } from "./pages/GetInvolvedPage";
import { LinksPage } from "./pages/LinksPage";
import { JobsPage } from "./pages/JobsPage";
import { RouteErrorFallback } from "./components/RouteErrorFallback";

const enableBlog = import.meta.env.VITE_ENABLE_BLOG === 'true';
const enableEvents = import.meta.env.VITE_ENABLE_EVENTS === 'true';
const enableResources = import.meta.env.VITE_ENABLE_RESOURCES === 'true';
const enableAssessment = import.meta.env.VITE_ENABLE_ASSESSMENT === 'true';
const enableGetInvolved = import.meta.env.VITE_ENABLE_GET_INVOLVED === 'true';
const enableJobs = import.meta.env.VITE_ENABLE_JOBS !== 'false';

const blogRoutes = enableBlog ? [
  { path: "blog",          Component: BlogIndexPage },
  { path: "blog/:slug",    Component: BlogPostPage },
] : [];

const eventRoutes = enableEvents ? [
  { path: "events", Component: EventsPage },
] : [];

const resourceRoutes = enableResources ? [
  { path: "resources", Component: ResourcesPage },
] : [];

const assessmentRoutes = enableAssessment ? [
  { path: "assessment", Component: AssessmentPage },
] : [];

const jobRoutes = enableJobs ? [
  { path: "jobs", Component: JobsPage },
  { path: "careers", Component: JobsPage },
] : [];

const getInvolvedRoutes = enableGetInvolved ? [
  { path: "get-involved", Component: GetInvolvedPage },
  { path: "collaborate", Component: GetInvolvedPage },
  { path: "become-a-guest", Component: GetInvolvedPage },
  { path: "mentor", Component: GetInvolvedPage },
] : [];

export const router = createBrowserRouter([
  {
    path: "/admin/*",
    lazy: async () => {
      const { AdminPage } = await import("./pages/AdminPage");
      return { Component: AdminPage };
    },
  },
  {
    path: "/links",
    Component: LinksPage,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    path: "/bio",
    Component: LinksPage,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    path: "/linktree",
    Component: LinksPage,
    ErrorBoundary: RouteErrorFallback,
  },


  {
    path: "/",
    Component: Layout,
    ErrorBoundary: RouteErrorFallback,
    children: [
      { index: true,       Component: HomePage     },
      { path: "episodes",  Component: EpisodesPage },
      { path: "practices", Component: PracticesPage },
      { path: "about",     Component: AboutPage    },
      { path: "team",      Component: TeamPage     },
      { path: "cookie-policy", Component: CookiePolicy },
      { path: "privacy-policy", Component: PrivacyPolicy },
      { path: "community-guidelines", Component: CommunityGuidelinesPage },
      { path: "code-of-conduct", Component: CommunityGuidelinesPage },
      ...jobRoutes,
      ...getInvolvedRoutes,
      ...resourceRoutes,
      ...assessmentRoutes,
      ...eventRoutes,
      ...blogRoutes,
    ],
  },
]);




