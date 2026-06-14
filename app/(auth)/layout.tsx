import { backgroundCSS } from "@/lib/utils";
import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      style={backgroundCSS}
      className="terminal-grid min-h-screen flex flex-col relative overflow-hidden w-full"
    >
      {/* Atmospheric Layer */}
      <div className="scanline z-0"></div>

      {/* System Status Indicator (Top Right) */}
      <div className="flex items-center justify-end gap-3 z-10 p-6">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
        </span>
        <span className="font-mono text-xs text-[#bbcabf] uppercase tracking-widest font-medium">
          System Active
        </span>
      </div>

      <main className="w-full px-8 z-10 flex flex-col flex-1 pt-8">
        {/* Logo Section */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-semibold text-[#4edea3] uppercase tracking-tighter mb-2">
            Dev Logs
          </h1>
          <p className="text-[13px] text-[#bbcabf] opacity-60">
            ENCRYPTED_ACCESS_PORTAL_V1.0.4
          </p>
        </header>

        {children}
      </main>
    </div>
  );
}
