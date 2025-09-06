import React, { useState } from "react";
import { Bell, Search, Plus, Menu } from "lucide-react";

function ProjectCard({ project }) {
  return (
    <article className="bg-[#0f1317] border border-gray-800 rounded-lg p-4 shadow-sm">
      <div className="h-36 rounded-md bg-gradient-to-br from-indigo-700 to-purple-700 relative overflow-hidden">
        {/* Placeholder "thumbnail" */}
        <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs">
          {project.date}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{project.title}</h3>
          <p className="text-sm text-gray-400">{project.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded bg-gray-800 text-sm">Open</button>
        </div>
      </div>
    </article>
  );
}

// FrontPage component that matches the provided mockup image
export default function FrontPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [projects] = useState([
    { id: 1, title: "Striking Falcon", subtitle: "Single-cell analysis", date: "12 Jul" },
    { id: 2, title: "True Quail", subtitle: "Clustering pipeline", date: "01 Jun" },
    { id: 3, title: "Witty Moose", subtitle: "Image segmentation", date: "28 May" },
    { id: 4, title: "Complete Dinosaur", subtitle: "Report export", date: "18 Apr" },
  ]);

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-gray-100 antialiased">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`flex flex-col transition-all duration-300 ease-in-out bg-[#0f1115] border-r border-gray-800 ${
            collapsed ? "w-20" : "w-64"
          } h-screen p-4`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-black font-bold">
                C
              </div>
              {!collapsed && <h1 className="font-semibold text-lg">Company</h1>}
            </div>
            <button
              aria-label="Toggle sidebar"
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded hover:bg-gray-800"
            >
              <Menu size={16} />
            </button>
          </div>

          <nav className="flex-1">
            <ul className="space-y-3">
              <li className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
                <div className="w-3 h-3 bg-green-400 rounded-full" />
                {!collapsed && <span>Projects</span>}
              </li>
              <li className="flex items-center gap-3 p-2 rounded hover:bg-gray-800">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                {!collapsed && <span>My Tasks</span>}
              </li>
            </ul>
          </nav>

          <div className="mt-auto">
            <div className="p-2 rounded bg-gray-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">TU</div>
              {!collapsed && (
                <div>
                  <div className="text-sm">Test User</div>
                  <div className="text-xs text-gray-400">user@mail</div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 p-6">
          {/* Topbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">Projects</h2>
              <div className="text-sm text-gray-400">&gt; Projects</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-[#111214] rounded p-2 gap-2 border border-gray-800">
                <Search size={16} />
                <input
                  placeholder="Search..."
                  className="bg-transparent outline-none text-sm w-48"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2 rounded bg-indigo-600 hover:brightness-105">
                <Plus size={14} />
                <span className="text-sm font-medium">New Project</span>
              </button>

              <button className="p-2 rounded hover:bg-gray-800">
                <Bell size={16} />
              </button>

              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400" />
            </div>
          </div>

          {/* Cards container */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}

            {/* Example: Empty state / giant card area to mimic "cards view" in mockup */}
            <div className="lg:col-span-3">
              <div className="mt-6 p-6 border border-dashed border-gray-800 rounded-lg text-gray-400">
                Cards view showing all the projects — drag, reorder, filter, and open project details from here.
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
