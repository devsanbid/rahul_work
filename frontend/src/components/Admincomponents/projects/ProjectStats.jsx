import React from 'react';
import { FolderOpen, Clock, CheckCircle, DollarSign } from 'lucide-react';

const ProjectStats = () => {
  const projects = [
    { status: 'In Progress', count: 2 },
    { status: 'Completed', count: 1 },
    { status: 'Pending', count: 1 },
    { status: 'Review', count: 1 }
  ];

  const totalProjects = 5;
  const inProgress = 2;
  const completed = 1;
  const totalBudget = 47450;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Projects</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{totalProjects}</p>
          </div>
          <FolderOpen className="w-6 sm:w-8 h-6 sm:h-8 text-[#d97757]" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{inProgress}</p>
          </div>
          <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Completed</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{completed}</p>
          </div>
          <CheckCircle className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Budget</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
          </div>
          <DollarSign className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default ProjectStats;
