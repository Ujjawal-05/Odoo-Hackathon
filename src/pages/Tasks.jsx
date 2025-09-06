// src/pages/Tasks.jsx
import SideBar from '../components/Sidebar';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'In Progress': return <Clock size={16} className="text-yellow-500" />;
      default: return <AlertCircle size={16} className="text-red-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      <SideBar />
      <main className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">My Tasks</h2>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-400">{task.project}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className="text-sm text-gray-400">{task.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
