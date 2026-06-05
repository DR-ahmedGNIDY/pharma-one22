"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { SecurityProvider } from "@/components/SecurityProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SecurityProvider>
        {children}
      </SecurityProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1A1A1A",
            color: "#F5F5F5",
            border: "1px solid rgba(212, 175, 55, 0.3)",
            fontFamily: "'Noto Sans Arabic', sans-serif",
          },
          success: {
            iconTheme: {
              primary: "#D4AF37",
              secondary: "#0B0B0B",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#0B0B0B",
            },
          },
        }}
      />
    </SessionProvider>
  );
}
