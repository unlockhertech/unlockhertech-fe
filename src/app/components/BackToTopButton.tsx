import { useState, useEffect } from "react";
import { HiArrowUp } from "react-icons/hi2";

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-24 right-5 z-40 p-3 rounded-full bg-stone-900/90 text-white shadow-xl hover:bg-[#B42970] focus:outline-none focus:ring-4 focus:ring-[#B42970]/30 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
      aria-label="Scroll back to top"
    >
      <HiArrowUp className="w-5 h-5" />
    </button>
  );
}
