import { useEffect } from "react";

export interface MetaDataOptions {
  image?: string;
  type?: "website" | "article" | "podcast";
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function setMetaTag(nameOrProperty: "name" | "property", key: string, content: string) {
  let element = document.querySelector(`meta[${nameOrProperty}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(nameOrProperty, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export function useMetaData(
  title: string,
  description?: string,
  canonical?: string,
  options?: MetaDataOptions
) {
  const optionImage = options?.image;
  const optionType = options?.type;
  const jsonLdString = options?.jsonLd ? JSON.stringify(options.jsonLd) : "";

  useEffect(() => {
    const baseTitle = "Unlock Her Tech";
    const finalTitle = title.includes(baseTitle) ? title : `${title} | ${baseTitle}`;
    document.title = finalTitle;

    const currentUrl = canonical || (globalThis.window !== undefined ? globalThis.location.href.split(/[?#]/)[0] : "https://unlockhertech.com/");

    if (description) {
      setMetaTag("name", "description", description);
      setMetaTag("property", "og:description", description);
      setMetaTag("name", "twitter:description", description);
    }

    // OpenGraph & Twitter Titles
    setMetaTag("property", "og:title", finalTitle);
    setMetaTag("name", "twitter:title", finalTitle);

    // Canonical link handling
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", currentUrl);
    setMetaTag("property", "og:url", currentUrl);
    setMetaTag("name", "twitter:url", currentUrl);

    // OpenGraph Type
    setMetaTag("property", "og:type", optionType || "website");

    // OpenGraph & Twitter Image
    if (optionImage) {
      const absoluteImage = optionImage.startsWith("http")
        ? optionImage
        : `https://unlockhertech.com${optionImage.startsWith("/") ? "" : "/"}${optionImage}`;
      setMetaTag("property", "og:image", absoluteImage);
      setMetaTag("name", "twitter:image", absoluteImage);
    }

    // Dynamic JSON-LD Schema
    const scriptId = "page-specific-jsonld";
    let jsonLdScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (jsonLdString) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement("script");
        jsonLdScript.id = scriptId;
        jsonLdScript.type = "application/ld+json";
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = jsonLdString;
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }

    return () => {
      // Clean up page-specific JSON-LD on unmount
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [title, description, canonical, optionImage, optionType, jsonLdString]);
}


