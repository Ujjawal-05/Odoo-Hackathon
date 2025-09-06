import Navbar from '../components/Navbar';
import SideBar from '../components/Sidebar';
import ProjectCard from '../components/ProjectCard';
import { Bell, Plus, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [projects, setProjects] = useState([
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (!token) {
    //   navigate("/login");
    // }
  }, [navigate]);

  const handleCreateProject = () => {
    const name = prompt('Enter project name:');
    if (name) {
      const newProject = {
        id: projects.length + 1,
        title: name,
        description: "New project description",
        status: "Open",
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
      };
      setProjects([...projects, newProject]);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      
      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-1">
        {/* Your Custom Sidebar */}
        <SideBar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Top Bar with Search and Actions */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>

            <div className="flex items-center gap-3">
              {/* Search Bar */}
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
                onClick={handleCreateProject}
              >
                <Plus size={16} /> New Project
              </button>

              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-700 transition">
                <Bell size={16} />
              </button>
            </div>
          </div>

          {/* Projects Grid */}
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
        </main>
      </div>
    </div>
  );
}
