import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiEye,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { developerAPI } from '../../services/api';

const DeveloperJobRequests = () => {
  const [activeFilter, setActiveFilter] = useState("pending");
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobRequests, setJobRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0
  });

  useEffect(() => {
    fetchJobRequests();
  }, [activeFilter]);

  const fetchJobRequests = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        status: activeFilter,
        page,
        limit: 10
      };
      const response = await developerAPI.getJobRequests(params);
      setJobRequests(response.data.jobRequests);
      setPagination(response.data.pagination);
    } catch (err) {
      console.error('Error fetching job requests:', err);
      setError('Failed to load job requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      await developerAPI.updateJobRequestStatus(jobId, action);
      // Refresh the job requests list
      fetchJobRequests(pagination.currentPage);
      setSelectedJob(null);
    } catch (err) {
      console.error('Error updating job request status:', err);
      setError('Failed to update job request status. Please try again.');
    }
  };

  const formatBudget = (budget, budgetType) => {
    if (budgetType === 'hourly') {
      return `$${budget}/hour`;
    }
    return `$${budget.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'declined': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getJobRequestCounts = () => {
    const counts = {
      all: pagination.totalRequests,
      pending: 0,
      accepted: 0,
      declined: 0
    };
    
    jobRequests.forEach(request => {
      if (counts[request.status] !== undefined) {
        counts[request.status]++;
      }
    });
    
    return counts;
  };

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {job.title}
            </h3>
            {job.isUrgent && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                Urgent
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <span className="mr-4">{job.client?.name || job.client}</span>
            {job.client?.rating && (
              <div className="flex items-center mr-4">
                <span className="text-yellow-500 mr-1">★</span>
                <span>{Number(parseFloat(job.client.rating) || 0).toFixed(1)}</span>
              </div>
            )}
            <FiClock className="mr-1" />
            <span>{formatDate(job.createdAt || job.postedDate)}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <FiDollarSign className="mr-1" />
          <span>{formatBudget(job.budget, job.budgetType)}</span>
        </div>
        <div className="flex items-center">
          <FiClock className="mr-1" />
          <span>{job.duration || job.experienceLevel}</span>
        </div>
        <div className="flex items-center">
          <FiMapPin className="mr-1" />
          <span>{job.location}</span>
        </div>
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-gray-500 text-xs">+{job.skills.length - 3} more</span>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectedJob(job)}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          <FiEye className="mr-1" />
          View Details
        </button>

        {job.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleJobAction(job.id, "accepted")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <FiCheck className="mr-1" />
              Accept
            </button>
            <button
              onClick={() => handleJobAction(job.id, "declined")}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <FiX className="mr-1" />
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const counts = getJobRequestCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Job Requests
          </h1>
          <p className="text-gray-600">
            Manage job requests sent directly to you by clients
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-wrap border-b border-gray-200">
            {[
              { key: "all", label: "All Requests", count: counts.all },
              { key: "pending", label: "Pending", count: counts.pending },
              { key: "accepted", label: "Accepted", count: counts.accepted },
              { key: "declined", label: "Declined", count: counts.declined },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeFilter === filter.key
                    ? "border-[#d97757] text-[#d97757] bg-orange-50"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {filter.label}
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="text-red-400">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Loading job requests...</p>
          </div>
        ) : (
          /* Job Requests Grid */
          <div className="grid gap-6">
            {jobRequests.length > 0 ? (
              jobRequests.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5M9 5v-.5" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No job requests found
                </h3>
                <p className="text-gray-500">
                  {activeFilter === "all"
                    ? "You haven't received any job requests yet."
                    : `No ${activeFilter} job requests at the moment.`}
                </p>
              </div>
            )}
          </div>
         )}

         {/* Pagination */}
         {!loading && jobRequests.length > 0 && pagination.totalPages > 1 && (
           <div className="flex justify-center items-center space-x-2 mt-8">
             <button
               onClick={() => fetchJobRequests(pagination.currentPage - 1)}
               disabled={pagination.currentPage === 1}
               className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Previous
             </button>
             
             {[...Array(pagination.totalPages)].map((_, index) => {
               const page = index + 1;
               return (
                 <button
                   key={page}
                   onClick={() => fetchJobRequests(page)}
                   className={`px-3 py-2 text-sm font-medium rounded-md ${
                     pagination.currentPage === page
                       ? 'bg-blue-600 text-white'
                       : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                   }`}
                 >
                   {page}
                 </button>
               );
             })}
             
             <button
               onClick={() => fetchJobRequests(pagination.currentPage + 1)}
               disabled={pagination.currentPage === pagination.totalPages}
               className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
             >
               Next
             </button>
           </div>
         )}
       </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedJob.title}
                    </h3>
                    {selectedJob.isUrgent && (
                      <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                      {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-2" />
                    <span className="mr-4">{selectedJob.client.name}</span>
                    <div className="flex items-center mr-4">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>{Number(selectedJob.client.rating || 0).toFixed(1)}</span>
                    </div>
                    <FiClock className="mr-1" />
                    <span>Posted {formatDate(selectedJob.createdAt)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Project Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedJob.description}</p>
                  </div>

                  {selectedJob.requirements && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h4>
                      <p className="text-gray-700 leading-relaxed">{selectedJob.requirements}</p>
                    </div>
                  )}

                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedJob.message && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Client Message</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 italic">"{selectedJob.message}"</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Budget</span>
                        <p className="text-lg font-semibold text-gray-900">{formatBudget(selectedJob.budget, selectedJob.budgetType)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Experience Level</span>
                        <p className="text-gray-900 capitalize">{selectedJob.experienceLevel}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Project Type</span>
                        <p className="text-gray-900 capitalize">{selectedJob.projectType}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Location</span>
                        <p className="text-gray-900">{selectedJob.location}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Category</span>
                        <p className="text-gray-900">{selectedJob.category}</p>
                      </div>
                      {selectedJob.deadline && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Deadline</span>
                          <p className="text-gray-900">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                        </div>
                      )}
                      {selectedJob.duration && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Duration</span>
                          <p className="text-gray-900">{selectedJob.duration}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedJob.status === "pending" && (
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleJobAction(selectedJob.id, "declined")}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <FiX className="mr-2" />
                    Decline Request
                  </button>
                  <button
                    onClick={() => handleJobAction(selectedJob.id, "accepted")}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                  >
                    <FiCheck className="mr-2" />
                    Accept Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperJobRequests;
