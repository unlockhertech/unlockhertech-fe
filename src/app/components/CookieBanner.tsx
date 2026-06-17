import { useState } from "react";
import { HiXMark } from "react-icons/hi2";
import { BERRY } from "../data";
import { CookiePolicyContent } from "../pages/CookiePolicy";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(() => {
    if (globalThis.window !== undefined) {
      return !localStorage.getItem("cookie-consent");
    }
    return false;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConsent = (status: "granted" | "denied") => {
    localStorage.setItem("cookie-consent", status);
    setIsVisible(false);
    setIsModalOpen(false);

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
    <>
      <div className="fixed inset-0 z-[100] flex flex-col justify-end">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-none" />
        
        {/* Banner Content */}
        <div className="relative z-10 w-full bg-white border-t border-gray-100 p-6 md:p-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold text-gray-900 mb-2">We value your privacy</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                We use cookies to enhance your browsing experience and analyze our traffic. 
                By clicking "Accept", you consent to our use of cookies.{" "}
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="underline hover:text-gray-900 transition-colors font-medium"
                >
                  Learn more
                </button>
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

      {/* Cookie Policy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-default"
            onClick={() => setIsModalOpen(false)}
            aria-label="Close modal"
            type="button"
          />
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Cookie Policy</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <CookiePolicyContent />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-8 py-3 rounded-full text-white font-bold shadow-lg hover:opacity-90 transition-opacity"
                style={{ backgroundColor: BERRY }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
