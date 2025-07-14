import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { adminAPI } from '../../../services/api';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setActivities(response.data.recentActivity || []);
    } catch (err) {
      setError('Failed to fetch recent activity');
      console.error('Error fetching recent activity:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const getActivityType = (activity) => {
    if (activity.type) return activity.type;
    if (activity.action?.includes('payment') || activity.action?.includes('transaction')) return 'payment';
    if (activity.action?.includes('project') || activity.action?.includes('proposal')) return 'project';
    return 'user';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <Activity className="w-5 h-5 text-gray-500" />
        </div>
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex items-start space-x-3 animate-pulse">
              <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-gray-200"></div>
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Activity className="w-5 h-5 text-gray-500" />
      </div>
      <div className="space-y-4">
        {error ? (
          <div className="text-center py-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => {
            const activityType = getActivityType(activity);
            return (
              <div key={activity.id || index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activityType === 'project' ? 'bg-[#d97757]' :
                  activityType === 'user' ? 'bg-blue-500' : 'bg-green-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user || activity.userName || 'Unknown User'}</span> {activity.action || activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.time || (activity.createdAt ? formatTimeAgo(activity.createdAt) : 'Unknown time')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RecentActivity;