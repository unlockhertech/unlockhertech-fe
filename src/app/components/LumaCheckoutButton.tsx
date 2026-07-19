import { useState } from "react";
import { ensureLumaCheckoutScript, getEventExternalUrl, getLumaEventId, openLumaCheckout } from "../utils/luma";

interface LumaCheckoutButtonProps {
  urlOrId: string;
  className?: string;
  children: React.ReactNode;
}

export function LumaCheckoutButton({ urlOrId, className, children }: Readonly<LumaCheckoutButtonProps>) {
  const [loading, setLoading] = useState(false);

  async function handleOpenCheckout() {
    const eventId = getLumaEventId(urlOrId);
    const fallbackUrl = getEventExternalUrl(urlOrId);

    if (!eventId) {
      if (fallbackUrl) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
      return;
    }

    setLoading(true);
    try {
      await ensureLumaCheckoutScript();
      const opened = openLumaCheckout(eventId);

      if (!opened && fallbackUrl) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Failed to open Luma checkout overlay:", err);
      if (fallbackUrl) {
        window.open(fallbackUrl, "_blank", "noopener,noreferrer");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleOpenCheckout}
      className={className}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? "Opening checkout..." : children}
    </button>
  );
}
