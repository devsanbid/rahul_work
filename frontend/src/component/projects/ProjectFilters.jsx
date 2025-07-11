import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const ProjectFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
        >
          <option value="all">All Projects</option>
          <option value="completed">Completed</option>
          <option value="in progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="review">Review</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
          <Filter className="w-5 h-5 text-gray-500" />
          <span>Advanced Filters</span>
        </button>
      </div>
    </div>
  );
};

export default ProjectFilters;