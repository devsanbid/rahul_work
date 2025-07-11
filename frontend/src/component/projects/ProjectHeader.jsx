import React from 'react';
import { Plus } from 'lucide-react';

const ProjectHeader = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Job List</h2>
        <p className="text-gray-600 mt-1">Manage all Job List Page</p>
      </div>
      <button className="mt-4 sm:mt-0 bg-[#d97757] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#c86a4a] transition-colors">
        <Plus className="w-5 h-5" />
        <span>New Job</span>
      </button>
    </div>
  );
};

export default ProjectHeader;