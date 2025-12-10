/**
 * @file login/page.tsx
 * @description Page de connexion/inscription.
 * Utilise LoginSection pour l'interface d'authentification.
 */

import React, { Suspense } from "react";
import LoginSection from "@/components/sections/LoginSection";

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <LoginSection />
    </Suspense>
  );
}

