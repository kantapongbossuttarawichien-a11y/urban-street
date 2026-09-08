"use client";

import { AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useEffect, useState, type ReactNode } from "react";

let openModalCount = 0;

interface ModalPortalProps {
  isOpen: boolean;
  children: ReactNode;
}

export function ModalPortal({ isOpen, children }: ModalPortalProps) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    openModalCount += 1;
    document.documentElement.classList.add("modal-open");
    document.body.classList.add("modal-open");

    return () => {
      openModalCount -= 1;
      if (openModalCount > 0) return;

      document.documentElement.classList.remove("modal-open");
      document.body.classList.remove("modal-open");
    };
  }, [isOpen]);

  if (!portalTarget) return null;

  return createPortal(
    <AnimatePresence>{isOpen ? children : null}</AnimatePresence>,
    portalTarget,
  );
}
