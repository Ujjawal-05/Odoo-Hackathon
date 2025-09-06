import SideBar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import NewProjectDialog from '../components/NewProjectDialog';
import { Bell, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState([
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      <SideBar />
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Projects</h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-700 px-2 py-1 rounded-lg w-64">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                className="ml-2 bg-transparent focus:outline-none text-sm w-full text-white"
              />
            </div>

            {/* New Project Button */}
            <button
              className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-500 transition"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus size={16} /> New Project
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-700 transition">
              <Bell size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              status={project.status}
              date={project.date}
            />
          ))}
        </div>

        {/* New Project Dialog */}
        <NewProjectDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onCreate={handleCreateProject}
        />
      </main>
    </div>
  );
}
