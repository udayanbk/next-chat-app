// app/page.tsx

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-green-100 px-6 text-center">
      
      {/* Hero Section */}
      <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
        Welcome to NeoChat
      </h1>

      <p className="text-gray-700 max-w-md mb-8">
        A simple and fast chatting application where you can connect with users,
        explore profiles, and chat instantly in real-time.
      </p>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition"
        >
          Login
        </a>

        <a
          href="/register"
          className="px-6 py-3 bg-white text-green-700 font-medium border border-green-600 rounded-lg hover:bg-green-50 transition"
        >
          Signup
        </a>

        <a
          href="/chat"
          className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
        >
          Start Chatting
        </a>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mt-10">
        © {new Date().getFullYear()} NeoChat — Built with Next.js & TailwindCSS
      </p>
    </main>
  );
}
