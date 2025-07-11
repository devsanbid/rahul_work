import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';

const UserFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
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
          <option value="all">All Users</option>
          <option value="developer">Developers</option>
          <option value="designer">Designers</option>
          <option value="client">Clients</option>
          <option value="manager">Managers</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="flex items-center justify-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-5 h-5 text-gray-500" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default UserFilters;