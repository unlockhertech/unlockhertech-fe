import {useEffect} from "react";

export function useMetaData(title: string, description?: string) {
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
  }, [title, description]);
}
