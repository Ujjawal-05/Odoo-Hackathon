import Navbar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import NewProjectDialog from '../components/NewProjectDialog';
import AddTasksToProjectDialog from '../components/AddTasksToProjectDialog';
import { Bell, Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [projects, setProjects] = useState([
  ]);

  // Dialog states
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Handle creating new project - automatically opens Add Tasks dialog
  const handleCreateProject = (newProject) => {
    setProjects(prev => [...prev, newProject]);
    setActiveProject(newProject);
    setIsNewProjectDialogOpen(false);
    setIsTasksDialogOpen(true);
  };

  const handleAddTasks = (tasks) => {
    console.log(`Added ${tasks.length} tasks to project "${activeProject.title}":`, tasks);
    alert(`Successfully added ${tasks.length} tasks to "${activeProject.title}"!`);
    setIsTasksDialogOpen(false);
    setActiveProject(null);
  };

  const handleProjectClick = (project) => {
    setActiveProject(project);
    setIsTasksDialogOpen(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-700 px-2 py-1 rounded-lg w-64">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="ml-2 bg-transparent focus:outline-none text-sm w-full text-white"
                />
              </div>

              <button
                className="flex items-center gap-1 bg-blue-600 px-3 py-1 rounded-lg hover:bg-blue-500 transition"
                onClick={() => setIsNewProjectDialogOpen(true)}
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
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>

          {/* New Project Dialog */}
          <NewProjectDialog
            isOpen={isNewProjectDialogOpen}
            onClose={() => setIsNewProjectDialogOpen(false)}
            onCreate={handleCreateProject}
          />

          {/* Add Tasks Dialog */}
          <AddTasksToProjectDialog
            isOpen={isTasksDialogOpen}
            onClose={() => {
              setIsTasksDialogOpen(false);
              setActiveProject(null);
            }}
            onSave={handleAddTasks}
            projectName={activeProject?.title || activeProject?.name}
          />
        </main>
      </div>
    </div>
  );
}
