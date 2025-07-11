import React, { useState, useEffect } from 'react';
import { Users, Shield, User, Star, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';

const UserStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    developers: 0,
    clients: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      const { stats: dashboardStats, usersByRole } = response.data;
      
      // Calculate role-specific counts
      const developers = usersByRole.find(role => role.role === 'developer')?.count || 0;
      const clients = usersByRole.find(role => role.role === 'client')?.count || 0;
      
      // Get active users count (assuming we need to fetch this separately)
      const usersResponse = await adminAPI.getAllUsers({ status: 'active' });
      const activeUsers = usersResponse.data.pagination.totalUsers;
      
      setStats({
        totalUsers: dashboardStats.totalUsers,
        activeUsers,
        developers,
        clients
      });
      setError(null);
    } catch (err) {
      setError('Failed to fetch user statistics');
      console.error('Error fetching user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#d97757]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 lg:col-span-4 bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <button 
              onClick={fetchUserStats}
              className="mt-2 px-4 py-2 bg-[#d97757] text-white rounded hover:bg-[#c86a4a] transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Users</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>
          <Users className="w-6 sm:w-8 h-6 sm:h-8 text-[#d97757]" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active Users</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
          </div>
          <Shield className="w-6 sm:w-8 h-6 sm:h-8 text-green-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Developers</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.developers}</p>
          </div>
          <User className="w-6 sm:w-8 h-6 sm:h-8 text-blue-500" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Clients</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.clients}</p>
          </div>
          <Star className="w-6 sm:w-8 h-6 sm:h-8 text-yellow-500" />
        </div>
      </div>
    </div>
  );
};

export default UserStats;