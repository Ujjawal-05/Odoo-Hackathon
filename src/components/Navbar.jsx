import { Bell, Plus, Search } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-800 text-white shadow">
      {/* Company logo/name */}
      <h1 className="text-2xl font-bold">Company</h1>

      {/* Search bar */}
      <div className="flex items-center bg-gray-700 px-2 py-1 rounded-lg w-64">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 bg-transparent focus:outline-none text-sm w-full"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-500">
          <Plus size={16} /> New Project
        </button>
        <button className="p-2 rounded-lg hover:bg-gray-700">
          <Bell />
        </button>
      </div>
    </nav>
  );
}