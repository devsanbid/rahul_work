import React, { useState, useEffect } from 'react';
import { developerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  FiTrendingUp,
  FiDollarSign,
  FiStar,
  FiBriefcase,
  FiClock,
  FiCheckCircle
} from 'react-icons/fi';

const DeveloperDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await developerAPI.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard:', err);
      // Set default data if API fails
      setDashboardData({
        stats: {
          totalEarnings: 0,
          activeProjects: 0,
          completedProjects: 0,
          pendingProposals: 0,
          averageRating: 0
        },
        recentProjects: [],
        recentProposals: [],
        availableJobs: []
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData ? [
    {
      label: 'Total Earnings',
      value: `$${dashboardData.stats.totalEarnings?.toLocaleString() || '0'}`,
      icon: FiDollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Active Projects',
      value: dashboardData.stats.activeProjects || '0',
      icon: FiBriefcase,
      color: 'bg-blue-500',
    },
    {
      label: 'Completed Projects',
      value: dashboardData.stats.completedProjects || '0',
      icon: FiCheckCircle,
      color: 'bg-green-600',
    },
    {
      label: 'Pending Proposals',
      value: dashboardData.stats.pendingProposals || '0',
      icon: FiClock,
      color: 'bg-yellow-500',
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Developer Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user?.name}! Here's what's happening with your projects.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Projects
          </h3>
          <div className="space-y-4">
            {dashboardData?.recentProjects?.length > 0 ? (
              dashboardData.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {project.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {project.status}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    ${project.budget}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent projects</p>
            )}
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Proposals
          </h3>
          <div className="space-y-4">
            {dashboardData?.recentProposals?.length > 0 ? (
              dashboardData.recentProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {proposal.jobTitle}
                    </p>
                    <p className="text-xs text-gray-500">
                      Status: {proposal.status}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    ${proposal.proposedBudget}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent proposals</p>
            )}
          </div>
        </div>
      </div>

      {/* Available Jobs */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Latest Available Jobs
          </h3>
          <a
            href="/developer/jobs"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </a>
        </div>
        <div className="space-y-4">
          {dashboardData?.availableJobs?.length > 0 ? (
            dashboardData.availableJobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-800 mb-1">
                    {job.title}
                  </h4>
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Budget: ${job.budget}</span>
                    <span>•</span>
                    <span>{job.proposalCount || 0} proposals</span>
                  </div>
                </div>
                <button className="ml-4 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">
                  View
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No available jobs</p>
          )}
        </div>
      </div>
    </div>
  );
};



export default DeveloperDashboard;
