"use client";
import React from "react";

export default function Header({ title }: { title?: string }) {
  return (
    <header className="w-full max-w-2xl mx-auto pt-8 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl text-gray-100 font-semibold">{title}</h1>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white">U</div>
        </div>
      </div>
    </header>
  );
}
