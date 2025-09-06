import { Bell, Search, Plus, Menu } from "lucide-react";
import ProjectCard from "../components/ProjectCard";

export default function FrontPage() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* ====== BODY (SIDEBAR + MAIN) ====== */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4 space-y-6">
          <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600">
            <Menu />
          </button>

          <div>
            <p className="text-gray-300 font-medium">Projects</p>
            <p className="text-gray-300 font-medium">My Tasks</p>
          </div>

          <div className="mt-10">
            <p className="text-sm text-gray-400">TU</p>
            <p className="text-white font-medium">Test User</p>
            <p className="text-gray-400 text-sm">user@mail</p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Projects</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ProjectCard
              title="Striking Falcon"
              description="Single-cell analysis"
              status="Open"
              date="01 Jun"
            />
            <ProjectCard
              title="Moonlight"
              description="AI-powered dashboard"
              status="Closed"
              date="12 Jul"
            />
            <ProjectCard
              title="Quantum Leap"
              description="Research study"
              status="In Progress"
              date="20 Aug"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
