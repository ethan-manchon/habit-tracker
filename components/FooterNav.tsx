"use client";
import React from "react";
import Link from "next/link";

export default function FooterNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur border-t border-gray-800">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex flex-col items-center text-sm text-gray-300">
          <span className="text-xl">🏠</span>
          <span className="mt-1">Accueil</span>
        </Link>
        <button className="flex flex-col items-center text-sm text-gray-500">
          <span className="text-xl">📈</span>
          <span className="mt-1">Stats</span>
        </button>
        <Link href="/profile" className="flex flex-col items-center text-sm text-gray-500">
          <span className="text-xl">👤</span>
          <span className="mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
