import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SideBar = () => {
  const [collapse, setCollapse] = useState(false);

  return (
    <>    
      <div className={`flex flex-col h-screen p-4 bg-gray-800 text-xl transition-all duration-300 font-semibold
          ${collapse ? 'w-20' : 'w-64'}`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setCollapse((prev) => !prev)}
          className="p-2 bg-gray-900 text-white rounded hover:bg-gray-600 transition"
        >
          {collapse ? '➡' : '⬅'} {/* Icon changes based on state */}
        </button>
        
        <div className="flex flex-col justify-between h-full">
          {/* Sidebar Content */}
          <div className={`flex flex-col justify-between h-[30%] mt-4 ${collapse ? 'items-center' : ''}`}>
            <div className={`${collapse ? 'hidden' : 'block'}`}>
              <h2>Company</h2>
            </div>

            <div className={`flex flex-col gap-5 ${collapse ? 'items-center' : ''}`}>
              <Link to="/projects" className={`${collapse ? 'hidden' : 'block'} hover:text-blue-600`}>
                Projects
              </Link>
              <Link to="/tasks" className={`${collapse ? 'hidden' : 'block'} hover:text-blue-600`}>
                Tasks
              </Link>
            </div>
          </div>

          <div className={`${collapse ? 'hidden' : 'block'}`}>
            User Details
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
