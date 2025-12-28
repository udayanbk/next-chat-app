import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/Header";

export const runtime = "nodejs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <div className="flex-1">{children}</div>
          <Toaster richColors position="top-center" />
        </AuthProvider>

      </body>
    </html>
  );
}
