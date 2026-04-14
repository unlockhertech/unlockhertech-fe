import React, { useState, useEffect } from "react";
import { BERRY } from "../data";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (status: "granted" | "denied") => {
    localStorage.setItem("cookie-consent", status);
    setIsVisible(false);

    // Update gtag consent
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: status,
        ad_storage: status,
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col justify-end">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" />
      
      {/* Banner Content */}
      <div className="relative z-10 w-full bg-white border-t border-gray-100 p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-gray-900 mb-2">We value your privacy</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We use cookies to enhance your browsing experience and analyze our traffic. 
              By clicking "Accept", you consent to our use of cookies.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => handleConsent("denied")}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200"
            >
              Decline
            </button>
            <button
              onClick={() => handleConsent("granted")}
              className="px-8 py-2.5 rounded-full text-sm font-semibold text-white shadow-md hover:opacity-90 transition-opacity"
              style={{ backgroundColor: BERRY }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
