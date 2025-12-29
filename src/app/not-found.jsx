import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="mb-6">Page Not Found</p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Go Home
      </Link>
    </div>
  );
}
