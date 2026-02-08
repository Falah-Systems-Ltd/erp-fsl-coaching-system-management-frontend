// src/app/layout.tsx
import { Toaster } from "sonner";
import { AuthProvider } from "../features/auth/context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Essential: The <html> tag must be here
    <html lang="en">
      {/* Essential: The <body> tag must wrap the content */}
      <body className="antialiased font-sans">
        {/* Sonner Toaster for global notifications */}
        <Toaster position="top-right" richColors closeButton />
        
        {/* AuthProvider wraps the app to provide user state */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}