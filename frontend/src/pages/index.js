import Link from "next/link";

export default function Home() {
  console.log("hej");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <nav className="flex justify-between items-center p-6 bg-white shadow">
        <h1 className="text-xl font-bold text-blue-600">MinBank</h1>
        <div className="space-x-4">
          <Link
            href="/"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Hem
          </Link>
          <Link
            href="/login"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Logga in
          </Link>
          <Link
            href="/signup"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Skapa konto
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div className="max-w-xl">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Din bank. Ditt val.
          </h2>
          <p className="text-gray-600 mb-6">
            Enkel och säker hantering av dina pengar – var du än är.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-blue-600 text-white text-lg font-medium py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Skapa konto
          </Link>
        </div>
      </main>
    </div>
  );
}
