import { useEffect } from "react";

/** Cierra un modal/overlay al pulsar Esc mientras está abierto. */
export default function useEscapeKey(isOpen, onClose) {
  useEffect(() => {
    if (!isOpen || typeof onClose !== "function") return undefined;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}
