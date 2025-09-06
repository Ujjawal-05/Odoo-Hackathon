import { Menu } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 p-4 text-white flex flex-col justify-between">
      <div>
        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 mb-6">
          <Menu />
        </button>

        <nav className="space-y-3">
          <p className="cursor-pointer hover:text-blue-400">Projects</p>
          <p className="cursor-pointer hover:text-blue-400">My Tasks</p>
        </nav>
      </div>

      <div>
        <p className="text-sm text-gray-400">TU</p>
        <p className="text-white font-medium">Test User</p>
        <p className="text-gray-400 text-sm">user@mail</p>
      </div>
    </aside>
  );
}
