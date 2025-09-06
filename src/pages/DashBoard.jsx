import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProjectCard from "../components/ProjectCard";

export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Sidebar + Main */}
      <div className="flex flex-1">
        <Sidebar />

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
