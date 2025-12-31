import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/Header";
import { ProfileModalProvider } from "../contexts/ProfileModalContext";


export const runtime = "nodejs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-200 min-h-screen flex flex-col items-center">
        <AuthProvider>
          <ProfileModalProvider>

            {/* CENTERED APP WRAPPER */}
            <div className="w-full max-w-[70vw] bg-white shadow-xl rounded-xl overflow-hidden mt-4 mb-4">

              {/* Header inside the container */}
              <Header />

              {/* Page content */}
              <div className="h-[calc(100vh-6rem)]">
                {children}
              </div>
            </div>

            <Toaster richColors position="top-center" />

          </ProfileModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
