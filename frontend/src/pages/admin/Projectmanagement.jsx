import React, { useState, useEffect } from "react";
import { adminAPI } from '../../services/api';
import { Eye, Trash2, Calendar, DollarSign, MapPin, User } from 'lucide-react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: '',
    category: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllJobs(filters);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        // Note: You may need to implement deleteJob in adminController
        alert(`Delete functionality for job ID: ${id} needs to be implemented`);
      } catch (err) {
        console.error('Error deleting job:', err);
        alert('Failed to delete job');
      }
    }
  };

  const handleView = (job) => {
    // You can implement a modal or navigate to job details
    alert(`Viewing job: ${job.title}\nClient: ${job.client?.name}\nBudget: $${job.budget}\nStatus: ${job.status}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97757]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchJobs}
            className="mt-4 px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-orange-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#d97757]">Job Listings</h1>
          <p className="text-gray-600 mt-2">Manage all job posts from users</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={filters.status} 
            onChange={(e) => setFilters({...filters, status: e.target.value, page: 1})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97757]"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="closed">Closed</option>
          </select>
          <select 
            value={filters.category} 
            onChange={(e) => setFilters({...filters, category: e.target.value, page: 1})}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97757]"
          >
            <option value="">All Categories</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Data Science">Data Science</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No jobs found</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow bg-white"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                          {job.title}
                        </h2>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{job.client?.name || 'Unknown Client'}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>${job.budget} ({job.budgetType})</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(job.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 line-clamp-2">{job.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Category: {job.category}</span>
                        <span>Experience: {job.experienceLevel}</span>
                        <span>Proposals: {job.proposalsCount}</span>
                        <span>Views: {job.viewsCount}</span>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleView(job)}
                          className="flex items-center px-4 py-2 border border-[#d97757] text-[#d97757] rounded-lg hover:bg-[#d97757] hover:text-white transition"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8">
              <button
                onClick={() => setFilters({...filters, page: Math.max(1, filters.page - 1)})}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalJobs} total jobs)
              </span>
              
              <button
                onClick={() => setFilters({...filters, page: Math.min(pagination.totalPages, filters.page + 1)})}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobList;
