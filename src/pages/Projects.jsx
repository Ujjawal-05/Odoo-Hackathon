import SideBar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import NewProjectDialog from '../components/NewProjectDialog';
import AddTasksToProjectDialog from '../components/AddTasksToProjectDialog';
import { Bell, Plus, Search } from 'lucide-react';
import { useState } from 'react';

export default function Projects() {
  const [projects, setProjects] = useState([
  ]);

  // Dialog states
  const [isNewProjectDialogOpen, setIsNewProjectDialogOpen] = useState(false);
  const [isTasksDialogOpen, setIsTasksDialogOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  // Handle creating new project - automatically opens Add Tasks dialog
  const handleCreateProject = (newProject) => {
    // Add project to list
    setProjects(prev => [...prev, newProject]);
    
    // Set as active project and open tasks dialog
    setActiveProject(newProject);
    setIsNewProjectDialogOpen(false); // Close project dialog
    setIsTasksDialogOpen(true); // Open tasks dialog
  };

  // Handle adding tasks to project
  const handleAddTasks = (tasks) => {
    console.log(`Added ${tasks.length} tasks to project "${activeProject.title}":`, tasks);
    // Here you can integrate with your backend API or update state
    alert(`Successfully added ${tasks.length} tasks to "${activeProject.title}"!`);
    
    // Close tasks dialog and reset active project
    setIsTasksDialogOpen(false);
    setActiveProject(null);
  };

  // Handle clicking on existing project card
  const handleProjectClick = (project) => {
    setActiveProject(project);
    setIsTasksDialogOpen(true);
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
  );
}
