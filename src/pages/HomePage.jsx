import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Welcome to Company App</h1>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
