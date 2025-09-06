import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  // Mock token check (replace with real logic later)
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/"; // Simple refresh to home
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link to="/">Synergy Sphere</Link>
      </div>

      {/* Navigation Buttons */}
      <div className="flex space-x-4">
        {/* Show Login & Signup ONLY on Home page when not logged in */}
        {!token && location.pathname === "/" && (
          <>
            <Link
              to="/login"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition"
            >
              Signup
            </Link>
          </>
        )}

        {/* Show Logout if logged in */}
        {token && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
