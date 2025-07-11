import React, { useState } from 'react';
import { EyeIcon, ChatBubbleLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const MyRequests = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const requests = [
    {
      id: 1,
      title: 'React Developer for E-commerce',
      status: 'pending',
      applications: 12,
      budget: '$5000',
      deadline: '2024-02-20',
      postedDate: '2024-01-15',
      description: 'Looking for an experienced React developer to build an e-commerce platform...'
    },
    {
      id: 2,
      title: 'Mobile App Developer',
      status: 'active',
      applications: 8,
      budget: '$8000',
      deadline: '2024-03-01',
      postedDate: '2024-01-10',
      description: 'Need a skilled mobile app developer for iOS and Android development...'
    },
    {
      id: 3,
      title: 'UI/UX Designer',
      status: 'completed',
      applications: 15,
      budget: '$3000',
      deadline: '2024-01-30',
      postedDate: '2024-01-05',
      description: 'Seeking a creative UI/UX designer for web application design...'
    },
    {
      id: 4,
      title: 'Backend Developer',
      status: 'cancelled',
      applications: 5,
      budget: '$6000',
      deadline: '2024-02-15',
      postedDate: '2024-01-12',
      description: 'Looking for a backend developer with Node.js expertise...'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon className="w-4 h-4" />;
      case 'cancelled': return <XCircleIcon className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredRequests = activeFilter === 'all' 
    ? requests 
    : requests.filter(request => request.status === activeFilter);

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
        <button className="mt-4 sm:mt-0 bg-[#d97757] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          Post New Request
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'pending', 'active', 'completed', 'cancelled'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
              activeFilter === filter
                ? 'bg-[#d97757] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map((request) => (
          <div key={request.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                {getStatusIcon(request.status)}
                <span className="ml-1 capitalize">{request.status}</span>
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <span className="text-gray-500">Budget:</span>
                <span className="ml-2 font-medium text-gray-900">{request.budget}</span>
              </div>
              <div>
                <span className="text-gray-500">Applications:</span>
                <span className="ml-2 font-medium text-gray-900">{request.applications}</span>
              </div>
              <div>
                <span className="text-gray-500">Deadline:</span>
                <span className="ml-2 font-medium text-gray-900">{request.deadline}</span>
              </div>
              <div>
                <span className="text-gray-500">Posted:</span>
                <span className="ml-2 font-medium text-gray-900">{request.postedDate}</span>
              </div>
            </div>

           
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No requests found for the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default MyRequests;
