import React from 'react';
import { Clock, FolderOpen, Users, TrendingUp } from 'lucide-react';

const AdditionalStats = ({ data }) => {
  const financialStats = data || {
    pendingPayments: 0,
    averageProjectValue: 0
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Pending Payments</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${financialStats.pendingPayments.toLocaleString()}</p>
          </div>
          <Clock className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Avg Project Value</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${financialStats.averageProjectValue.toLocaleString()}</p>
          </div>
          <FolderOpen className="w-6 sm:w-8 h-6 sm:h-8 text-purple-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Clients</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">28</p>
          </div>
          <Users className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">+12.5%</p>
          </div>
          <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
        </div>
      </div>
    </div>
  );
};

export default AdditionalStats;