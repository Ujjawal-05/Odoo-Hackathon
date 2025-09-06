import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Synergy Sphere</h1>
      <p className="text-lg text-gray-300 mb-8">Your project management solution</p>
      
      <div className="flex gap-4">
        <Link
          to="/projects"
          className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-500 text-white font-medium transition"
        >
          View Projects
        </Link>
        <Link
          to="/dashboard"
          className="px-8 py-3 bg-green-600 rounded-lg hover:bg-green-500 text-white font-medium transition"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
