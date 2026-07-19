import { Link, isRouteErrorResponse, useRouteError } from "react-router";

export function RouteErrorFallback() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message = "We hit an unexpected issue while loading this page.";

  if (isRouteErrorResponse(error)) {
    title = error.status === 404 ? "Page not found" : `${error.status} ${error.statusText}`;
    message =
      typeof error.data === "string"
        ? error.data
        : "The page could not be loaded. Please try again.";
  } else if (error instanceof Error && error.message) {
    message = error.message;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16 bg-stone-50">
      <div className="max-w-xl w-full rounded-3xl border border-gray-200 bg-white p-8 md:p-10 text-center shadow-sm">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-brand-coral mb-3">Oops</p>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => globalThis.location.reload()}
            className="px-5 py-2.5 rounded-full bg-brand-coral text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <button
            type="button"
            onClick={() => globalThis.history.back()}
            className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Go back
          </button>
          <Link
            to="/"
            className="px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}