/**
 * @file Modal.tsx
 * @description Composant modal réutilisable avec overlay et animations.
 * 
 * @usage
 * ```tsx
 * <Modal onClose={() => setOpen(false)}>
 *   <Card>Contenu du modal</Card>
 * </Modal>
 * ```
 * 
 * @features
 * - Fermeture au clic sur l'overlay
 * - Fermeture avec la touche Échap
 * - Animation d'entrée/sortie avec motion
 * - Backdrop blur
 */

"use client";
import { useCallback, useRef, useEffect, MouseEventHandler } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Modal({
  children,
  className,
  onClose,
}: {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}) {
  const overlay = useRef(null);
  const wrapper = useRef(null);

  const onDismiss = useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  const onClick: MouseEventHandler = useCallback(
    (e) => {
      if (e.target === overlay.current || e.target === wrapper.current) {
        if (onDismiss) onDismiss();
      }
    },
    [onDismiss, overlay, wrapper]
  );

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss();
    },
    [onDismiss]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        ref={overlay}
        className="fixed z-50 left-0 right-0 top-0 bottom-0 mx-auto bg-overlay backdrop-blur-sm"
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={wrapper}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md px-3 sm:px-4 pb-20 ${
            className ? className : ""
          }`}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
