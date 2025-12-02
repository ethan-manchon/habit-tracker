"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Home, Stats, User } from "@/lib/Icon";

const navItems = [
  { href: "/", icon: Home, label: "Accueil" },
  { href: "/stats", icon: Stats, label: "Stats" },
  { href: "/profile", icon: User, label: "Profil" },
];

export default function FooterNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border safe-area-bottom z-50">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2 sm:py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === "/" && pathname === "/");
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className="relative flex flex-col items-center min-w-[60px] py-1"
            >
              <motion.div
                className={`p-2 rounded-xl ${isActive ? "bg-accent/10" : ""}`}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
              >
                <Icon 
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? "text-accent" : "text-muted"}`} 
                />
              </motion.div>
              <span className={`text-[10px] sm:text-xs mt-0.5 font-medium ${isActive ? "text-accent" : "text-muted"}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  className="absolute -bottom-2 w-1 h-1 rounded-full bg-accent"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
