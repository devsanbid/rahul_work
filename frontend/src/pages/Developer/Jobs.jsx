import React, { useState, useEffect } from "react";
import {
  FiClock,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiFileText,
  FiMapPin,
  FiEye,
  FiX,
  FiSend,
  FiHeart,
} from "react-icons/fi";
import { developerAPI, proposalAPI } from '../../services/api';

const DeveloperJobs = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0
  });
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [proposalJob, setProposalJob] = useState(null);
  const [proposalData, setProposalData] = useState({
    coverLetter: '',
    proposedBudget: '',
    proposedTimeline: ''
  });
  const [submittingProposal, setSubmittingProposal] = useState(false);
  const [proposalError, setProposalError] = useState('');
  const [proposalSuccess, setProposalSuccess] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [activeFilter]);

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const params = {
        page,
        limit: 20
      };
      
      if (activeFilter !== 'all') {
        params.category = activeFilter;
      }
      
      const response = await developerAPI.getAvailableJobs(params);
      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getJobCategories = () => {
    const categories = [
      { key: "all", label: "All Jobs", count: pagination.totalJobs },
      { key: "web-development", label: "Web Development" },
      { key: "backend", label: "Backend" },
      { key: "frontend", label: "Frontend" },
      { key: "mobile", label: "Mobile" },
      { key: "data-science", label: "Data Science" },
      { key: "wordpress", label: "WordPress" },
      { key: "design", label: "Design" }
    ];
    
    return categories.map(cat => ({
      ...cat,
      count: cat.key === 'all' ? pagination.totalJobs : 0
    }));
  };

  const formatBudget = (budget, type) => {
    if (type === "hourly") {
      return `$${budget}/hr`;
    }
    return `$${parseFloat(budget).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getClientInfo = (job) => {
    return {
      name: job.client?.name || 'Anonymous Client',
      rating: parseFloat(job.client?.rating) || 0,
      reviews: job.client?.totalProjects || 0
    };
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const openProposalModal = (job) => {
    setProposalJob(job);
    setProposalData({
      coverLetter: '',
      proposedBudget: job.budgetType === 'hourly' ? '' : job.budget,
      proposedTimeline: ''
    });
    setProposalError('');
    setProposalSuccess('');
    setShowProposalModal(true);
  };

  const closeProposalModal = () => {
    setShowProposalModal(false);
    setProposalJob(null);
    setProposalData({
      coverLetter: '',
      proposedBudget: '',
      proposedTimeline: ''
    });
    setProposalError('');
    setProposalSuccess('');
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!proposalJob) return;

    setSubmittingProposal(true);
    setProposalError('');

    try {
      await proposalAPI.createProposal(proposalJob.id, proposalData);
      setProposalSuccess('Proposal submitted successfully!');
      setTimeout(() => {
        closeProposalModal();
        fetchJobs(pagination.currentPage);
      }, 2000);
    } catch (err) {
      setProposalError(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleProposalChange = (field, value) => {
    setProposalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const JobCard = ({ job }) => {
    const clientInfo = getClientInfo(job);
    
    return (
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-2 hover:text-[#d97757] cursor-pointer">
              {job.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <FiUser size={14} className="mr-1" />
              <span className="mr-4">{clientInfo.name}</span>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span>
                  {Number(clientInfo.rating || 0).toFixed(1)} ({clientInfo.reviews} projects)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`p-2 rounded-full transition-colors ${
              savedJobs.has(job.id)
                ? "text-red-500 bg-red-50 hover:bg-red-100"
                : "text-gray-400 hover:text-red-500 hover:bg-gray-50"
            }`}
          >
            <FiHeart
              size={18}
              fill={savedJobs.has(job.id) ? "currentColor" : "none"}
            />
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
          {job.description}
        </p>

        {/* Job Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FiDollarSign size={14} className="mr-1" />
            <span>{formatBudget(job.budget, job.budgetType)}</span>
          </div>
          <div className="flex items-center">
            <FiClock size={14} className="mr-1" />
            <span>{job.experienceLevel}</span>
          </div>
          <div className="flex items-center">
            <FiMapPin size={14} className="mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center">
            <FiCalendar size={14} className="mr-1" />
            <span>Posted {formatDate(job.createdAt)}</span>
          </div>
        </div>

        {/* Proposals count and category */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {job.category}
          </span>
          <span className="text-sm text-gray-600">{job.proposalsCount || 0} proposals</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => setSelectedJob(job)}
            className="flex-1 flex items-center justify-center px-4 py-2 border border-[#d97757] text-[#d97757] rounded-lg hover:bg-[#d97757] hover:text-white transition-colors"
          >
            <FiEye size={16} className="mr-2" />
            View Details
          </button>
          <button 
            onClick={() => openProposalModal(job)}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
          >
            <FiSend size={16} className="mr-2" />
            Submit Proposal
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97757]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Available Jobs
        </h2>
        <p className="text-gray-600">
          Find and apply to jobs that match your skills
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {getJobCategories().map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeFilter === filter.key
                  ? "bg-[#d97757] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter.label} {filter.key === 'all' ? `(${filter.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-6">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No jobs found for the selected category.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => fetchJobs(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchJobs(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedJob.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="mr-4">Client: {getClientInfo(selectedJob).name}</span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span>
                        {Number(getClientInfo(selectedJob).rating || 0).toFixed(1)} ({getClientInfo(selectedJob).reviews}{" "}
                        reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Project Details */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Job Description
                  </h4>
                  <p className="text-gray-700 mb-6">
                    {selectedJob.description}
                  </p>

                  {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-800 mb-4">
                        Requirements
                      </h4>
                      <ul className="list-disc list-inside space-y-2 mb-6">
                        {selectedJob.requirements.map((req, index) => (
                          <li key={index} className="text-gray-700">
                            {req}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {selectedJob.skills && selectedJob.skills.length > 0 && (
                    <>
                      <h4 className="font-semibold text-gray-800 mb-4">
                        Skills Required
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedJob.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Job Info Sidebar */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    Job Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget
                      </label>
                      <p className="text-gray-900 font-semibold">
                        {formatBudget(
                          selectedJob.budget,
                          selectedJob.budgetType
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Experience Level
                      </label>
                      <p className="text-gray-900">{selectedJob.experienceLevel}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Location
                      </label>
                      <p className="text-gray-900">{selectedJob.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Posted
                      </label>
                      <p className="text-gray-900">
                        {formatDate(selectedJob.createdAt)}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Proposals
                      </label>
                      <p className="text-gray-900">
                        {selectedJob.proposalsCount || 0} submitted
                      </p>
                    </div>
                    {selectedJob.deadline && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Deadline
                        </label>
                        <p className="text-gray-900">
                          {formatDate(selectedJob.deadline)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    <button 
                      onClick={() => openProposalModal(selectedJob)}
                      className="w-full px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
                    >
                      Submit Proposal
                    </button>
                    <button
                      onClick={() => toggleSaveJob(selectedJob.id)}
                      className={`w-full px-4 py-2 border rounded-lg transition-colors ${
                        savedJobs.has(selectedJob.id)
                          ? "border-red-500 text-red-500 bg-red-50"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {savedJobs.has(selectedJob.id) ? "Saved" : "Save Job"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Proposal Submission Modal */}
      {showProposalModal && proposalJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Submit Proposal
                  </h3>
                  <p className="text-gray-600">
                    Job: {proposalJob.title}
                  </p>
                </div>
                <button
                  onClick={closeProposalModal}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX size={20} />
                </button>
              </div>

              {proposalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {proposalError}
                </div>
              )}

              {proposalSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                  {proposalSuccess}
                </div>
              )}

              <form onSubmit={handleProposalSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={proposalData.coverLetter}
                    onChange={(e) => handleProposalChange('coverLetter', e.target.value)}
                    placeholder="Explain why you're the best fit for this job..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Budget * ({proposalJob.budgetType === 'hourly' ? 'per hour' : 'total'})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={proposalData.proposedBudget}
                      onChange={(e) => handleProposalChange('proposedBudget', e.target.value)}
                      placeholder={proposalJob.budgetType === 'hourly' ? '25' : '1000'}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                      required
                      min="1"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Client's budget: {formatBudget(proposalJob.budget, proposalJob.budgetType)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposed Timeline *
                  </label>
                  <input
                    type="text"
                    value={proposalData.proposedTimeline}
                    onChange={(e) => handleProposalChange('proposedTimeline', e.target.value)}
                    placeholder="e.g., 2 weeks, 1 month, 3-5 days"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeProposalModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProposal}
                    className="flex-1 px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingProposal ? 'Submitting...' : 'Submit Proposal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperJobs;
