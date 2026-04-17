import { useEffect } from "react";

export function useAutoScrollInput() {
  useEffect(() => {
    const handler = (e: FocusEvent) => {
      const target = e.target as HTMLElement;

      if (!target) return;

      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 300); // wait for keyboard
    };

    document.addEventListener("focusin", handler);

    return () => {
      document.removeEventListener("focusin", handler);
    };
  }, []);
}