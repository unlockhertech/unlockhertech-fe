const LUMA_CHECKOUT_SCRIPT_ID = "luma-checkout";
const LUMA_CHECKOUT_SCRIPT_SRC = "https://embed.lu.ma/checkout-button.js";

export function getLumaEventId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();

  if (!trimmed) return null;
  if (trimmed.startsWith("evt-")) return trimmed;

  try {
    const parsed = new URL(trimmed);
    const idFromQuery = parsed.searchParams.get("eid") ?? parsed.searchParams.get("event_id");
    if (idFromQuery?.startsWith("evt-")) return idFromQuery;

    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const idFromPath = pathParts.find((part) => part.startsWith("evt-"));
    return idFromPath ?? null;
  } catch {
    return null;
  }
}

export function getEventExternalUrl(urlOrId: string): string {
  const trimmed = urlOrId.trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  if (trimmed.startsWith("evt-")) {
    return `https://lu.ma/event/${trimmed}`;
  }

  return `https://lu.ma/${trimmed}`;
}

export function openLumaCheckout(eventId: string): boolean {
  if (window.LumaCheckout?.open) {
    window.LumaCheckout.open({ eventId });
    return true;
  }

  if (window.luma?.checkout) {
    window.luma.checkout({ eventId });
    return true;
  }

  if (window.luma?.openCheckout) {
    window.luma.openCheckout({ eventId });
    return true;
  }

  return false;
}

export async function ensureLumaCheckoutScript(): Promise<void> {
  const existingScript = document.getElementById(LUMA_CHECKOUT_SCRIPT_ID) as HTMLScriptElement | null;

  if (existingScript) {
    if (existingScript.dataset.loaded === "true") return;
    await waitForScript(existingScript);
    return;
  }

  const script = document.createElement("script");
  script.id = LUMA_CHECKOUT_SCRIPT_ID;
  script.src = LUMA_CHECKOUT_SCRIPT_SRC;
  script.async = true;

  const loadPromise = new Promise<void>((resolve, reject) => {
    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    });
    script.addEventListener("error", () => {
      reject(new Error("Unable to load Luma checkout script."));
    });
  });

  document.head.appendChild(script);
  await loadPromise;
}

function waitForScript(script: HTMLScriptElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (script.dataset.loaded === "true") {
      resolve();
      return;
    }

    script.addEventListener("load", () => {
      script.dataset.loaded = "true";
      resolve();
    }, { once: true });

    script.addEventListener("error", () => {
      reject(new Error("Unable to load Luma checkout script."));
    }, { once: true });
  });
}
