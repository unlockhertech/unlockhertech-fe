import { useState } from "react";
import { Link } from "react-router";
import { BERRY } from "../data";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    if (globalThis.window !== undefined) {
      return !localStorage.getItem("cookie-consent");
    }
    return false;
  });

  const handleConsent = (status: "granted" | "denied") => {
    localStorage.setItem("cookie-consent", status);
    setIsVisible(false);

    // Update gtag consent
    const win = globalThis as unknown as { gtag?: (command: string, action: string, params: Record<string, string>) => void };
    if (win?.gtag) {
      win.gtag("consent", "update", {
        analytics_storage: status,
        ad_storage: status,
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs pointer-events-auto" />
      
      {/* Banner Content */}
      <div className="relative z-10 w-full bg-white border-t border-gray-100 p-6 md:p-8 pointer-events-auto shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Your Privacy Matters</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use essential and anonymized analytics cookies to enhance your browsing experience and improve our platform.{" "}
              <Link 
                to="/cookie-policy"
                className="underline hover:text-gray-900 transition-colors font-semibold"
              >
                Learn more & manage preferences
              </Link>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => handleConsent("denied")}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => handleConsent("granted")}
              className="px-8 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity cursor-pointer"
              style={{ backgroundColor: BERRY }}
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
