// src/app/layout.tsx
import { Toaster } from "sonner"; //
import { AuthProvider } from "../features/auth/context/AuthContext";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* RichColors makes error toasts red and success toasts green */}
        <Toaster position="top-right" richColors closeButton /> 
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}