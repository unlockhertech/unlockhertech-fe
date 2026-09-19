import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { RouteErrorFallback } from "./components/RouteErrorFallback";
import { PageLoadingFallback } from "./components/PageLoadingFallback";

const enableBlog = import.meta.env.VITE_ENABLE_BLOG === 'true';
const enableEvents = import.meta.env.VITE_ENABLE_EVENTS === 'true';
const enableResources = import.meta.env.VITE_ENABLE_RESOURCES === 'true';
const enableAssessment = import.meta.env.VITE_ENABLE_ASSESSMENT === 'true';
const enableGetInvolved = import.meta.env.VITE_ENABLE_GET_INVOLVED === 'true';
const enableJobs = import.meta.env.VITE_ENABLE_JOBS !== 'false';

const blogRoutes = enableBlog ? [
  {
    path: "blog",
    lazy: async () => {
      const { BlogIndexPage } = await import("./pages/BlogIndexPage");
      return { Component: BlogIndexPage };
    },
  },
  {
    path: "blog/:slug",
    lazy: async () => {
      const { BlogPostPage } = await import("./pages/BlogPostPage");
      return { Component: BlogPostPage };
    },
  },
] : [];

const eventRoutes = enableEvents ? [
  {
    path: "events",
    lazy: async () => {
      const { EventsPage } = await import("./pages/EventsPage");
      return { Component: EventsPage };
    },
  },
] : [];

const resourceRoutes = enableResources ? [
  {
    path: "resources",
    lazy: async () => {
      const { ResourcesPage } = await import("./pages/ResourcesPage");
      return { Component: ResourcesPage };
    },
  },
] : [];

const assessmentRoutes = enableAssessment ? [
  {
    path: "assessment",
    lazy: async () => {
      const { AssessmentPage } = await import("./pages/AssessmentPage");
      return { Component: AssessmentPage };
    },
  },
] : [];

const jobRoutes = enableJobs ? [
  {
    path: "jobs",
    lazy: async () => {
      const { JobsPage } = await import("./pages/JobsPage");
      return { Component: JobsPage };
    },
  },
  {
    path: "careers",
    lazy: async () => {
      const { JobsPage } = await import("./pages/JobsPage");
      return { Component: JobsPage };
    },
  },
] : [];

const getInvolvedRoutes = enableGetInvolved ? [
  {
    path: "get-involved",
    lazy: async () => {
      const { GetInvolvedPage } = await import("./pages/GetInvolvedPage");
      return { Component: GetInvolvedPage };
    },
  },
  {
    path: "collaborate",
    lazy: async () => {
      const { GetInvolvedPage } = await import("./pages/GetInvolvedPage");
      return { Component: GetInvolvedPage };
    },
  },
  {
    path: "become-a-guest",
    lazy: async () => {
      const { GetInvolvedPage } = await import("./pages/GetInvolvedPage");
      return { Component: GetInvolvedPage };
    },
  },
  {
    path: "mentor",
    lazy: async () => {
      const { GetInvolvedPage } = await import("./pages/GetInvolvedPage");
      return { Component: GetInvolvedPage };
    },
  },
] : [];

export const router = createBrowserRouter([
  {
    path: "/admin/*",
    lazy: async () => {
      const { AdminPage } = await import("./pages/AdminPage");
      return { Component: AdminPage };
    },
    HydrateFallback: PageLoadingFallback,
  },
  {
    path: "/links",
    lazy: async () => {
      const { LinksPage } = await import("./pages/LinksPage");
      return { Component: LinksPage };
    },
    HydrateFallback: PageLoadingFallback,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    path: "/bio",
    lazy: async () => {
      const { LinksPage } = await import("./pages/LinksPage");
      return { Component: LinksPage };
    },
    HydrateFallback: PageLoadingFallback,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    path: "/linktree",
    lazy: async () => {
      const { LinksPage } = await import("./pages/LinksPage");
      return { Component: LinksPage };
    },
    HydrateFallback: PageLoadingFallback,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    path: "/private-booking-portal",
    lazy: async () => {
      const { BookingPage } = await import("./pages/BookingPortalPage");
      return { Component: BookingPage };
    },
    HydrateFallback: PageLoadingFallback,
    ErrorBoundary: RouteErrorFallback,
  },
  {
    path: "/",
    Component: Layout,
    HydrateFallback: PageLoadingFallback,
    ErrorBoundary: RouteErrorFallback,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "episodes",
        lazy: async () => {
          const { EpisodesPage } = await import("./pages/EpisodesPage");
          return { Component: EpisodesPage };
        },
      },
      {
        path: "practices",
        lazy: async () => {
          const { PracticesPage } = await import("./pages/PracticesPage");
          return { Component: PracticesPage };
        },
      },
      {
        path: "practice",
        lazy: async () => {
          const { PracticesPage } = await import("./pages/PracticesPage");
          return { Component: PracticesPage };
        },
      },
      {
        path: "she-leads-tech",
        lazy: async () => {
          const { PracticesPage } = await import("./pages/PracticesPage");
          return { Component: PracticesPage };
        },
      },
      {
        path: "paths",
        lazy: async () => {
          const { PathsIndexPage } = await import("./pages/paths/PathsIndexPage");
          return { Component: PathsIndexPage };
        },
      },
      {
        path: "paths/:slug",
        lazy: async () => {
          const { PathDetailPage } = await import("./pages/paths/PathDetailPage");
          return { Component: PathDetailPage };
        },
      },
      {
        path: "about",
        lazy: async () => {
          const { AboutPage } = await import("./pages/AboutPage");
          return { Component: AboutPage };
        },
      },
      {
        path: "team",
        lazy: async () => {
          const { TeamPage } = await import("./pages/TeamPage");
          return { Component: TeamPage };
        },
      },
      {
        path: "cookie-policy",
        lazy: async () => {
          const { CookiePolicy } = await import("./pages/CookiePolicy");
          return { Component: CookiePolicy };
        },
      },
      {
        path: "privacy-policy",
        lazy: async () => {
          const { PrivacyPolicy } = await import("./pages/PrivacyPolicy");
          return { Component: PrivacyPolicy };
        },
      },
      {
        path: "community-guidelines",
        lazy: async () => {
          const { CommunityGuidelinesPage } = await import("./pages/CommunityGuidelinesPage");
          return { Component: CommunityGuidelinesPage };
        },
      },
      {
        path: "code-of-conduct",
        lazy: async () => {
          const { CommunityGuidelinesPage } = await import("./pages/CommunityGuidelinesPage");
          return { Component: CommunityGuidelinesPage };
        },
      },
      ...jobRoutes,
      ...getInvolvedRoutes,
      ...resourceRoutes,
      ...assessmentRoutes,
      ...eventRoutes,
      ...blogRoutes,
    ],
  },
]);




