import React, { useState } from 'react';
import { X, Plus, Trash2, User, Calendar, FileText } from 'lucide-react';

function TaskInputRow({ task, index, onChange, onRemove, canRemove }) {
  return (
    <div className="bg-gray-700 p-4 rounded-lg mb-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">        
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-1">
            <FileText size={14} className="inline mr-1" />
            Task Description *
          </label>
          <input
            type="text"
            placeholder="Enter task description"
            value={task.description}
            onChange={(e) => onChange(index, 'description', e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            <User size={14} className="inline mr-1" />
            Assign to *
          </label>
          <input
            type="text"
            placeholder="Enter assignee name"
            value={task.assignee}
            onChange={(e) => onChange(index, 'assignee', e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            <Calendar size={14} className="inline mr-1" />
            Deadline
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={task.deadline}
              onChange={(e) => onChange(index, 'deadline', e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {canRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded transition"
                title="Remove Task"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={task.priority}
            onChange={(e) => onChange(index, 'priority', e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={task.status}
            onChange={(e) => onChange(index, 'status', e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Done">Done</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default function AddTasksToProjectDialog({ isOpen, onClose, onSave, projectName }) {
  const [tasks, setTasks] = useState([{
    description: '',
    assignee: '',
    deadline: '',
    priority: 'Medium',
    status: 'Todo'
  }]);

  // Don't render if dialog is closed
  if (!isOpen) return null;

  const handleTaskChange = (index, field, value) => {
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      newTasks[index][field] = value;
      return newTasks;
    });
  };

  const handleAddTask = () => {
    setTasks(prevTasks => [...prevTasks, {
      description: '',
      assignee: '',
      deadline: '',
      priority: 'Medium',
      status: 'Todo'
    }]);
  };

  const handleRemoveTask = (index) => {
    if (tasks.length > 1) {
      setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const validTasks = tasks.filter(task => 
      task.description.trim() !== '' && task.assignee.trim() !== ''
    );

    if (validTasks.length === 0) {
      alert('Please add at least one task with description and assignee.');
      return;
    }

    // Add IDs and project info to tasks
    const tasksWithIds = validTasks.map((task, index) => ({
      ...task,
      id: Date.now() + index,
      projectName: projectName,
      createdAt: new Date().toISOString(),
      dateAdded: new Date().toLocaleDateString('en-GB', { 
        day: '2-digit', 
        month: 'short',
        year: 'numeric'
      })
    }));

    onSave(tasksWithIds);
    handleClose();
  };

  const handleClose = () => {
    // Reset form
    setTasks([{
      description: '',
      assignee: '',
      deadline: '',
      priority: 'Medium',
      status: 'Todo'
    }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4 text-white max-h-[90vh] overflow-y-auto">        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Add Tasks to Project</h2>
            {projectName && (
              <p className="text-gray-400 text-sm mt-1">
                Project: <span className="text-blue-400">{projectName}</span>
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-700 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">            
            <div className="max-h-96 overflow-y-auto">
              {tasks.map((task, index) => (
                <TaskInputRow
                  key={index}
                  task={task}
                  index={index}
                  onChange={handleTaskChange}
                  onRemove={handleRemoveTask}
                  canRemove={tasks.length > 1}
                />
              ))}
            </div>
            
            <button
              type="button"
              onClick={handleAddTask}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition"
            >
              <Plus size={16} />
              Add Another Task
            </button>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>Summary:</strong> {tasks.length} task{tasks.length !== 1 ? 's' : ''} will be added to this project.
              </p>
              {tasks.filter(t => t.description.trim() !== '' && t.assignee.trim() !== '').length !== tasks.length && (
                <p className="text-sm text-yellow-400 mt-1">
                  ⚠️ Some tasks are missing required fields and will be excluded.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white transition flex items-center gap-2"
            >
              <Plus size={16} />
              Add {tasks.filter(t => t.description.trim() !== '' && t.assignee.trim() !== '').length} Tasks
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
