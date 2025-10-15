"use client";

import { useEffect, useState, ReactNode } from "react";
import { Modal } from "@/components/Modal";

type PageModalProps = {
  openDelay?: number; // tempo até abrir (ms)
  visibleDuration?: number; // tempo visível após abrir (ms)
  onOpen?: () => void;
  onClose?: () => void;
  children?: ReactNode;
};

export function PageModal({
  openDelay = 1000,
  visibleDuration = 1000,
  onOpen,
  onClose,
  children,
}: PageModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Abre após openDelay
    const openTimer = setTimeout(() => {
      setIsOpen(true);
      onOpen?.();
    }, openDelay);

    // Fecha após openDelay + visibleDuration
    const closeTimer = setTimeout(() => {
      setIsOpen(false);
      onClose?.();
    }, openDelay + visibleDuration);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [openDelay, visibleDuration, onOpen, onClose]);

  return <Modal hideBackdrop isOpen={isOpen} onClose={() => setIsOpen(false)}>{children}</Modal>;
}