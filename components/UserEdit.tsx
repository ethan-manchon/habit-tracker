"use client";
import React from "react";
import { motion } from "motion/react";
import { User, Mail, Lock, Edit, Check, X } from "@/lib/Icon";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface UserEditProps {
    userId?: string;
}

export default function UserEdit({ userId }: UserEditProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState("Utilisateur");
  const [email, setEmail] = React.useState("user@example.com");

  return (
    <motion.div
      className="w-full max-w-lg mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 sm:p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <motion.div 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-accent/10 flex items-center justify-center mb-3"
            whileHover={{ scale: 1.05 }}
          >
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-accent" />
          </motion.div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground">{name}</h2>
          <p className="text-xs sm:text-sm text-muted">{email}</p>
        </div>

        {/* Edit Form */}
        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
              Nom
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              className="text-sm sm:text-base"
              icon={<User className="w-4 h-4 text-muted" />}
            />
          </div>

          <div>
            <label className="text-xs sm:text-sm font-medium text-foreground mb-1.5 block">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              className="text-sm sm:text-base"
              icon={<Mail className="w-4 h-4 text-muted" />}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4 sm:mt-6 pt-4 border-t border-border">
          {isEditing ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => setIsEditing(false)}
                className="text-xs sm:text-sm flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                Annuler
              </Button>
              <Button 
                onClick={() => setIsEditing(false)}
                className="text-xs sm:text-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Sauvegarder
              </Button>
            </>
          ) : (
            <Button 
              variant="secondary"
              onClick={() => setIsEditing(true)}
              className="text-xs sm:text-sm flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Button>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
