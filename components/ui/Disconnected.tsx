/**
 * @file Disconnected.tsx
 * @description Bouton de déconnexion avec deux modes d'affichage.
 * 
 * @usage
 * ```tsx
 * <Disconnected />           // Version texte (bouton ghost)
 * <Disconnected button />    // Version icône (bouton gradient)
 * ```
 * 
 * @props
 * - button: Si true, affiche un bouton icône compact. Sinon, affiche un bouton texte.
 */

"use client";

import { signOut } from "next-auth/react";
import { motion } from "motion/react";
import { Door } from "@/lib/Icon";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";

interface DisconnectedProps {
  button?: boolean;
}

export default function Disconnected({ button }: DisconnectedProps) {
  const handleSignOut = () => signOut({ callbackUrl: "/" });

  if (button) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <IconButton
          variant="gradient"
          size="sm"
          onClick={handleSignOut}
          aria-label="Se déconnecter"
        >
          <Door className="w-4 h-4" />
        </IconButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Button
        variant="ghost"
        fullWidth
        onClick={handleSignOut}
        className="text-danger hover:bg-danger-soft"
      >
        Se déconnecter
      </Button>
    </motion.div>
  );
}
