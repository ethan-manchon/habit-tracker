"use client";
import React, { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, Lock, Edit, Check, X, Trash, Sun, Moon, ChevronRight } from "@/lib/Icon";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useTheme } from "next-themes";
import Modal from "@/components/Modal";
import Disconnected from "../ui/Disconnected";

export default function ProfileContent() {
  const { data: session, update: updateSession } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Password change state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Stats
  const [stats, setStats] = useState<{ totalRoutines: number; completedToday: number; streak: number } | null>(null);

  // Modal routines
  const [showAllRoutines, setShowAllRoutines] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setUsername(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  // Fetch user stats
  useEffect(() => {
    fetch("/api/stats?days=30")
      .then((res) => res.json())
      .then((data) => {
        if (data.routines && data.dailyData) {
          const today = data.dailyData[data.dailyData.length - 1];
          // Calculate streak
          let streak = 0;
          for (let i = data.dailyData.length - 1; i >= 0; i--) {
            const d = data.dailyData[i];
            if (d.total > 0 && d.completed === d.total) {
              streak++;
            } else if (d.total > 0) {
              break;
            }
          }
          setStats({
            totalRoutines: data.routines.length,
            completedToday: today?.completed || 0,
            streak,
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      await updateSession({ name: username, email });
      setSuccess("Profil mis à jour !");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    
    if (newPassword.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors du changement");
      }

      setShowPasswordModal(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess("Mot de passe modifié !");
    } catch (err: any) {
      setPasswordError(err.message);
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "SUPPRIMER") return;

    setDeleting(true);

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      signOut({ callbackUrl: "/" });
    } catch (err) {
      setDeleting(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="w-full max-w-lg mx-auto pb-24 space-y-4">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden">
          {/* Header with gradient */}
          <div className="h-20 sm:h-24 bg-gradient-to-r from-accent to-purple-600" />
          
          <CardContent className="p-4 sm:p-6 -mt-10 sm:-mt-12">
            {/* Avatar */}
            <motion.div 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-card border-4 border-card flex items-center justify-center mx-auto mb-3 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-accent" />
            </motion.div>

            {/* User Info */}
            {!isEditing ? (
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {session?.user?.name || "Utilisateur"}
                </h2>
                <p className="text-sm text-muted">{session?.user?.email}</p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nom d'utilisateur"
                  icon={<User className="w-4 h-4 text-muted" />}
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  icon={<Mail className="w-4 h-4 text-muted" />}
                />
              </div>
            )}

            {/* Feedback messages */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-danger text-center mb-3"
                >
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-success text-center mb-3"
                >
                  {success}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Edit Actions */}
            <div className="flex justify-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setIsEditing(false);
                      setUsername(session?.user?.name || "");
                      setEmail(session?.user?.email || "");
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    {saving ? "..." : "Sauvegarder"}
                  </Button>
                </>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5"
                >
                  <Edit className="w-4 h-4" />
                  Modifier le profil
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Card */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-accent">{stats.totalRoutines}</p>
                <p className="text-xs text-muted">Routines</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-success">{stats.completedToday}</p>
                <p className="text-xs text-muted">Aujourd&apos;hui</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-warning">{stats.streak}</p>
                <p className="text-xs text-muted">Série 🔥</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader className="p-4 pb-2">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wide">
              Paramètres
            </h3>
          </CardHeader>
          <CardContent className="p-2">
            
            {/* Voir toutes les routines */}
            <motion.button
              onClick={() => setShowAllRoutines(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-accent/10 to-purple-100 hover:from-accent/20 hover:to-purple-200 transition-colors mb-2 shadow"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium text-foreground">Voir toutes mes routines</span>
              </div>
              <ChevronRight className="w-4 h-4 text-accent" />
            </motion.button>
            {/* Theme Toggle */}
            <motion.button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-background-secondary transition-colors mb-2"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-accent" />
                ) : (
                  <Sun className="w-5 h-5 text-accent" />
                )}
                <span className="text-sm font-medium text-foreground">Thème</span>
              </div>
              <span className="text-sm text-muted">
                {theme === "dark" ? "Sombre" : "Clair"}
              </span>
            </motion.button>

            {/* Change Password */}
            <motion.button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-background-secondary transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted" />
                <span className="text-sm font-medium text-foreground">Changer le mot de passe</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted" />
            </motion.button>

          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card variant="outline" className="border-danger/30">
          <CardHeader className="p-4 pb-2">
            <h3 className="text-sm font-semibold text-danger uppercase tracking-wide">
              Zone de danger
            </h3>
          </CardHeader>
          <CardContent className="p-2">
            <motion.button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-danger-soft transition-colors cursor-pointer"
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <Trash className="w-5 h-5 text-danger" />
                <span className="text-sm font-medium text-danger">Supprimer mon compte</span>
              </div>
              <ChevronRight className="w-4 h-4 text-danger" />
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal onClose={() => setShowPasswordModal(false)}>
            <Card className="w-full max-w-sm">
              <CardHeader className="p-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Changer le mot de passe</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <Input
                  type="password"
                  placeholder="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-sm text-danger">{passwordError}</p>
                )}
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowPasswordModal(false)}>
                    <X className="w-4 h-4" />
                    Annuler
                  </Button>
                  <Button onClick={handlePasswordChange} disabled={passwordSaving}>
                    <Check className="w-4 h-4" />
                    {passwordSaving ? "..." : "Confirmer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <Card className="w-full max-w-sm">
              <CardHeader className="p-4">
                <h3 className="text-lg font-bold text-danger">Supprimer le compte</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-4">
                <p className="text-sm text-muted">
                  Cette action est irréversible. Toutes vos routines et données seront supprimées.
                </p>
                <p className="text-sm text-foreground">
                  Tapez [<strong>SUPPRIMER</strong>] pour confirmer :
                </p>
                <Input
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  placeholder="Cette action est irréversible"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
                    Annuler
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleDeleteAccount}
                    disabled={deleteConfirm !== "SUPPRIMER" || deleting}
                  >
                    {deleting ? "..." : "Supprimer"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showAllRoutines && (
          <Modal onClose={() => setShowAllRoutines(false)}>
            {/* Modal personnalisé pour la liste des routines */}
            <React.Suspense fallback={<div>Chargement...</div>}>
              {typeof window !== "undefined" && (
                <>
                  {React.createElement(require("../AllRoutinesModal").default, {
                    open: true,
                    onClose: () => setShowAllRoutines(false),
                  })}
                </>
              )}
            </React.Suspense>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
