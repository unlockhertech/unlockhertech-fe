import {useEffect} from "react";

export function useMetaData(title: string, description?: string, canonical?: string) {
  useEffect(() => {
    const baseTitle = "Unlock Her Tech";
    document.title = title === baseTitle ? title : `${title} | ${baseTitle}`;

    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Canonical link handling
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    
    const canonicalUrl = canonical || globalThis.location.href.split(/[?#]/)[0];
    canonicalLink.setAttribute('href', canonicalUrl);

    return () => {
      // Optional: Reset canonical if needed on unmount, 
      // but usually it's better to just let the next page overwrite it.
    };
  }, [title, description, canonical]);
}
