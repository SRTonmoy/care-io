import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Care.xyz
        </Link>

        <div className="space-x-4">
          <Link href="/login" className="hover:text-blue-600">
            Login
          </Link>
          <Link href="/register" className="hover:text-blue-600">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
