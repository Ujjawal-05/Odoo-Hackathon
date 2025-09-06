import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Folder, CheckSquare, User, Home, Building2 } from 'lucide-react';

const SideBar = () => {
  const [collapse, setCollapse] = useState(false);

  return (
    <div className={`flex flex-col h-screen p-4 bg-[#152739] text-xl transition-all duration-300 font-semibold
        ${collapse ? 'w-20' : 'w-64'}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapse((prev) => !prev)}
        className="p-2 bg-[#1d364f] text-white rounded hover:bg-[#324f6b]  transition mb-4 flex items-center justify-center"
      >
        <Menu size={20} />
      </button>
      
      <div className='flex flex-col justify-between h-full'>
        {/* Top Section */}
        <div className={`flex flex-col ${collapse ? 'items-center' : ''}`}>
          {/* Company Logo/Name */}
          <div className={`flex items-center gap-3 mb-6 ${collapse ? 'justify-center' : ''}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-white font-bold">
              <Building2 size={20} />
            </div>
            {!collapse && <h2 className="text-lg">Company</h2>}
          </div>

          {/* Navigation Links */}
          <div className={`flex flex-col gap-5 w-full ${collapse ? 'items-center' : ''}`}>
            <Link 
              to="/projects" 
              className={`flex items-center gap-3 p-2 rounded hover:bg-[#324f6b] transition text-base
                ${collapse ? 'justify-center w-12 h-12' : 'w-full'}`}
              title={collapse ? "Projects" : ""}
            >
              <Folder size={20} />
              {!collapse && <span>Projects</span>}
            </Link>
            
            <Link 
              to="/tasks" 
              className={`flex items-center gap-3 p-2 rounded hover:bg-[#324f6b] transition text-base
                ${collapse ? 'justify-center w-12 h-12' : 'w-full'}`}
              title={collapse ? "Tasks" : ""}
            >
              <CheckSquare size={20} />
              {!collapse && <span>Tasks</span>}
            </Link>

            <Link 
              to="/dashboard" 
              className={`flex items-center gap-3 p-2 rounded hover:bg-[#324f6b] transition text-base
                ${collapse ? 'justify-center w-12 h-12' : 'w-full'}`}
              title={collapse ? "Dashboard" : ""}
            >
              <Home size={20} />
              {!collapse && <span>Dashboard</span>}
            </Link>
          </div>
        </div>

        {/* Bottom User Section */}
        <div className={`p-2 rounded bg-[#204366] flex items-center gap-3
          ${collapse ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User size={16} />
          </div>
          {!collapse && (
            <div className="text-sm">
              <p className="font-medium">Test User</p>
              <p className="text-xs text-gray-300">user@mail.com</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
