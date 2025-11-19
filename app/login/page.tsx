"use client";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Card, Input } from "@/components/ui";
import { Lock } from "@/lib/Icon";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [verifyLink, setVerifyLink] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  // Read query params for errors or verification
  useEffect(() => {
    try {
      const err = searchParams?.get('error');
      const verified = searchParams?.get('verified');
      if (err) {
        // human friendly mapping for common NextAuth errors
        let msg = err;
        if (err === 'OAuthAccountNotLinked') msg = 'Ce compte Google est déjà lié à un autre compte.';
        if (err === 'Configuration') msg = 'Problème de configuration du provider.';
        setErrorMessage(msg);
      }
      if (verified) {
        setSuccessMessage('Ton e‑mail a été vérifié — tu peux maintenant te connecter.');
      }
    } catch (e) {
      // ignore
    }
  }, [searchParams]);

  // Simple password strength calculator: score 0..4
  const getPasswordScore = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score += 1;
    if (/[A-Za-z]/.test(pw)) score += 1;
    if (/[0-9]/.test(pw)) score += 1;
    if (/[^A-Za-z0-9]/.test(pw)) score += 1;
    return score;
  };

  const passwordScore = getPasswordScore(password);
  const strengthLabel = password.length === 0 ? "—" : passwordScore <= 1 ? "Faible" : passwordScore === 2 ? "Moyen" : passwordScore === 3 ? "Fort" : "Très Fort";
  const strengthColor = password.length === 0 ? "bg-gray-700" : passwordScore <= 1 ? "bg-red-500" : passwordScore === 2 ? "bg-yellow-400" : passwordScore === 3 ? "bg-green-500" : "bg-green-700";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Routines</h1>
          <p className="text-gray-400 text-sm">Transforme tes habitudes en réussites</p>
        </div>

        {/* Auth Card */}
        <Card padding="lg">
          {/* Tabs */}
          <div className="flex bg-gray-900 rounded-lg p-1 mb-6">
            <button
              onClick={() => setActiveTab("connexion")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition ${activeTab === "connexion"
                  ? "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setActiveTab("inscription")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium cursor-pointer transition ${activeTab === "inscription" ?
                  "bg-gray-700 text-white"
                  : "text-gray-400 hover:text-white"
                }`}
            >
              Inscription
            </button>
          </div>

          {/* Connexion Form */}
          {activeTab === "connexion" && (
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setErrorMessage("");
              setSuccessMessage("");
              setLoading(true);
              try {
                const res = await signIn('credentials', { redirect: false, email, password });
                setLoading(false);
                // @ts-ignore
                if (res?.error) {
                  // Map common NextAuth error codes to friendly messages
                  const code = res.error;
                  if (code === 'CredentialsSignin') {
                    setErrorMessage('Identifiants invalides. Vérifie ton email et mot de passe.');
                  } else {
                    setErrorMessage(res.error || 'Échec de la connexion');
                  }
                } else {
                  // Use a full reload to ensure server reads the session cookie
                  if (typeof window !== 'undefined') {
                    window.location.href = '/';
                  } else {
                    router.push('/');
                  }
                }
              } catch (err: any) {
                setLoading(false);
                setErrorMessage(err?.message || 'Erreur');
              }
            }}>
              {/* Email Input */}
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoFocus={true}
                icon={
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              {/* Password Input */}
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                icon={
                  <Lock className="text-gray-500" />
                }
              />

              {/* Forgot Password Link */}
              <div className="text-right">
                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">
                  Mot de passe oublié ?
                </a>
              </div>

              {/* Submit Button */}
              <Button type="submit" variant="default" fullWidth>
                {loading ? 'Connexion…' : 'Se connecter'}
              </Button>
              {errorMessage && <p className="text-sm text-red-400 pt-2">{errorMessage}</p>}
            </form>
          )}

          {/* Inscription Form */}
          {activeTab === "inscription" && (
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              setErrorMessage("");
              setSuccessMessage("");
              if (!email || !password) {
                setErrorMessage('Email et mot de passe requis');
                return;
              }
              if (password !== confirmPassword) {
                setErrorMessage('Les mots de passe ne correspondent pas');
                return;
              }
              setLoading(true);
              try {
                const resp = await fetch('/api/auth/register', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ email, password, pseudo }),
                });
                const data = await resp.json();
                setLoading(false);
                if (!resp.ok) {
                  setErrorMessage(data?.error || 'Erreur lors de l\'inscription');
                } else {
                  // data may include { emailed, verifyUrl }
                  if (data?.emailed) {
                    setSuccessMessage('Compte créé — un email de vérification a été envoyé.');
                  } else if (data?.verifyUrl) {
                    setSuccessMessage('Compte créé — verification link (local) :');
                    setVerifyLink(data.verifyUrl);
                  } else {
                    setSuccessMessage('Compte créé — vérifie ton email pour activer le compte.');
                  }
                  setPassword('');
                  setConfirmPassword('');
                  setActiveTab('connexion');
                }
              } catch (err: any) {
                setLoading(false);
                setErrorMessage(err?.message || 'Erreur');
              }
            }}>
              {/* Email Input */}
              <Input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Pseudo"
                icon={
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                icon={
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />

              {/* Password Input */}
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                icon={
                  <Lock className="text-gray-500" />
                }
              />
               {/* Password strength meter (inscription) */}
              { password !== "" && (
                <div className="mt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400">Sécurité du mot de passe</span>
                    <span className={`text-sm ${password.length ? 'text-white' : 'text-gray-500'}`}>{strengthLabel}</span>
                  </div>
                  <div className="bg-gray-900 rounded h-2 overflow-hidden">
                    <div className={`${strengthColor} h-2`} style={{ width: `${(passwordScore / 4) * 100}%` }} />
                  </div>
                </div>
              )}
              {/* Confirm Password */}
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                icon={
                  <Lock className="text-gray-500" />
                }
              />
             {password && confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-gray-400 -mt-3">Les mots de passe ne correspondent pas.</p>
              )}
              {/* Submit Button */}
              <Button type="submit" variant="default" fullWidth>
                {loading ? 'Création…' : 'Créer un compte'}
              </Button>
              {errorMessage && <p className="text-sm text-red-400 pt-2">{errorMessage}</p>}
              {successMessage && <p className="text-sm text-green-400 pt-2">{successMessage}</p>}
              {verifyLink && (
                <p className="text-sm text-gray-300 break-words mt-2">Lien de vérification : <a className="text-indigo-400 break-all" href={verifyLink} target="_blank" rel="noreferrer">{verifyLink}</a></p>
              )}
            </form>
          )}

          {/* Divider */}
          <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-800 text-gray-400">ou</span>
        </div>
      </div>

      {/* Google Sign In */}
      <Button
        onClick={() => signIn("google", { callbackUrl: "/" })}
        variant="secondary"
        fullWidth
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Connexion avec Google
      </Button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-6">
        En continuant, tu acceptes nos conditions d&apos;utilisation.
        <br />
        Tes données sont protégées et sécurisées. 🔒
      </p>
    </Card>
      </div >
    </div >
  );
}
