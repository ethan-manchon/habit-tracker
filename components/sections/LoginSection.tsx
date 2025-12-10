/**
 * @file LoginSection.tsx
 * @description Section d'authentification avec onglets connexion/inscription.
 * 
 * @usage
 * ```tsx
 * <LoginSection />
 * ```
 * 
 * @features
 * - Onglets connexion / inscription
 * - Indicateur de force du mot de passe
 * - Gestion des erreurs et succès
 * - Redirection après connexion réussie
 * 
 * @state
 * - activeTab: Onglet actif (connexion ou inscription)
 * - loading: État de chargement pendant la soumission
 * - errorMessage / successMessage: Messages de feedback
 */

"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Lock, Mail, User, CheckCircle } from "@/lib/Icon";

/**
 * Calcule un score de force pour le mot de passe (0-4).
 */
function getPasswordScore(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Za-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return score;
}

/**
 * Retourne le label et la couleur selon le score.
 */
function getStrengthInfo(score: number, hasPassword: boolean) {
  if (!hasPassword) return { label: "—", color: "bg-background-tertiary" };
  if (score <= 1) return { label: "Faible", color: "bg-danger" };
  if (score === 2) return { label: "Moyen", color: "bg-warning" };
  if (score === 3) return { label: "Fort", color: "bg-success" };
  return { label: "Très Fort", color: "bg-green-700" };
}

export default function LoginSection() {
  const [activeTab, setActiveTab] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupère l'erreur depuis l'URL si présente
  useEffect(() => {
    try {
      const err = searchParams?.get("error");
      if (err) {
        const msg = err === "Configuration" ? "Problème de configuration." : err;
        setErrorMessage(msg);
      }
    } catch {
      // ignore
    }
  }, [searchParams]);

  const passwordScore = getPasswordScore(password);
  const { label: strengthLabel, color: strengthColor } = getStrengthInfo(passwordScore, password.length > 0);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await signIn("credentials", { redirect: false, email, password });
      setLoading(false);

      if (res?.error) {
        const msg = res.error === "CredentialsSignin" ? "Identifiants invalides." : res.error;
        setErrorMessage(msg);
      } else {
        window.location.href = "/";
      }
    } catch (err: unknown) {
      setLoading(false);
      setErrorMessage(err instanceof Error ? err.message : "Erreur");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Email et mot de passe requis");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, pseudo }),
      });
      const data = await resp.json();
      setLoading(false);

      if (!resp.ok) {
        setErrorMessage(data?.error || "Erreur lors de l'inscription");
      } else {
        setSuccessMessage("Compte créé ! Tu peux maintenant te connecter.");
        setPassword("");
        setConfirmPassword("");
        setActiveTab("connexion");
      }
    } catch (err: unknown) {
      setLoading(false);
      setErrorMessage(err instanceof Error ? err.message : "Erreur");
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header avec logo */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            className="flex justify-center mb-3 sm:mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent flex items-center justify-center shadow-accent">
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
            </div>
          </motion.div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1.5 sm:mb-2">
            Routines
          </h1>
          <p className="text-muted text-xs sm:text-sm">
            Transforme tes habitudes en réussites
          </p>
        </div>

        <Card padding="lg" className="p-4 sm:p-6">
          {/* Onglets */}
          <div className="flex bg-background-secondary rounded-xl p-1 mb-4 sm:mb-6">
            <motion.button
              onClick={() => setActiveTab("connexion")}
              className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition ${
                activeTab === "connexion"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Connexion
            </motion.button>
            <motion.button
              onClick={() => setActiveTab("inscription")}
              className={`flex-1 py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg text-xs sm:text-sm font-medium cursor-pointer transition ${
                activeTab === "inscription"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
              whileTap={{ scale: 0.98 }}
            >
              Inscription
            </motion.button>
          </div>

          {/* Formulaire Connexion */}
          {activeTab === "connexion" && (
            <motion.form
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleLogin}
            >
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoFocus
                icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />}
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />}
              />
              <Button type="submit" variant="default" fullWidth>
                {loading ? <LoadingSpinner size="sm" className="text-white" /> : "Se connecter"}
              </Button>
              {errorMessage && (
                <p className="text-xs sm:text-sm text-danger pt-1 sm:pt-2">{errorMessage}</p>
              )}
            </motion.form>
          )}

          {/* Formulaire Inscription */}
          {activeTab === "inscription" && (
            <motion.form
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRegister}
            >
              <Input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Pseudo"
                icon={<User className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />}
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />}
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />}
              />

              {/* Indicateur de force du mot de passe */}
              {password !== "" && (
                <motion.div
                  className="mt-1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs sm:text-sm text-muted">
                      Sécurité du mot de passe
                    </span>
                    <span className="text-xs sm:text-sm text-foreground">
                      {strengthLabel}
                    </span>
                  </div>
                  <div className="bg-background-secondary rounded h-1.5 sm:h-2 overflow-hidden">
                    <motion.div
                      className={`${strengthColor} h-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(passwordScore / 4) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.div>
              )}

              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                icon={<Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted" />}
              />

              {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-danger -mt-2">
                  Les mots de passe ne correspondent pas.
                </p>
              )}

              <Button type="submit" variant="default" fullWidth>
                {loading ? <LoadingSpinner size="sm" className="text-white" /> : "Créer un compte"}
              </Button>
              {errorMessage && (
                <p className="text-xs sm:text-sm text-danger pt-1 sm:pt-2">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-xs sm:text-sm text-success pt-1 sm:pt-2">{successMessage}</p>
              )}
            </motion.form>
          )}

          {/* Footer légal */}
          <p className="text-2xs sm:text-xs text-muted text-center mt-4 sm:mt-6">
            En continuant, tu acceptes nos conditions d&apos;utilisation.
            <br />
            <span className="inline-flex items-center gap-1">
              Tes données sont protégées et sécurisées.
              <Lock className="w-3 h-3 inline" />
            </span>
          </p>
        </Card>
      </motion.div>
    </section>
  );
}
