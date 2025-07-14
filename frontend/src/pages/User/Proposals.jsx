import React, { useState, useEffect } from 'react';
import {
  FiUser,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiCheck,
  FiX,
  FiEye,
  FiStar,
  FiMapPin,
  FiFileText,
  FiMessageSquare
} from 'react-icons/fi';
import { jobAPI, proposalAPI } from '../../services/api';
import FeedbackSystem from '../../components/Developercomponents/FeedbackSystem'

const UserProposals = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedProposalForFeedback, setSelectedProposalForFeedback] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await jobAPI.getMyJobs();
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError('Failed to fetch your jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async (jobId) => {
    try {
      setProposalsLoading(true);
      setError('');
      const response = await proposalAPI.getJobProposals(jobId);
      setProposals(response.data.proposals || []);
    } catch (err) {
      setError('Failed to fetch proposals for this job');
      console.error('Error fetching proposals:', err);
    } finally {
      setProposalsLoading(false);
    }
  };

  const handleJobSelect = (job) => {
    setSelectedJob(job);
    fetchProposals(job.id);
  };

  const handleProposalAction = async (proposalId, status) => {
    try {
      setActionLoading(true);
      setError('');
      await proposalAPI.updateProposalStatus(proposalId, status);
      setSuccessMessage(`Proposal ${status} successfully!`);

      if (selectedJob) {
        fetchProposals(selectedJob.id);
      }

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${status} proposal`);
    } finally {
      setActionLoading(false);
    }
  };

  const openProposalModal = (proposal) => {
    setSelectedProposal(proposal);
    setShowProposalModal(true);
  };

  const closeProposalModal = () => {
    setSelectedProposal(null);
    setShowProposalModal(false);
  };

  const formatBudget = (budget, type) => {
    if (type === 'hourly') {
      return `$${budget}/hr`;
    }
    return `$${parseFloat(budget).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          Manage Proposals
        </h2>
        <p className="text-gray-600">
          Review and manage proposals from developers for your posted jobs
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs List */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Jobs</h3>
          <div className="space-y-3">
            {jobs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No jobs found. Post a job to start receiving proposals.
              </p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleJobSelect(job)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedJob?.id === job.id
                    ? 'border-[#d97757] bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                >
                  <h4 className="font-medium text-gray-800 mb-2">{job.title}</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <FiDollarSign size={14} className="mr-1" />
                      <span>{formatBudget(job.budget, job.budgetType)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar size={14} className="mr-1" />
                      <span>Posted {formatDate(job.createdAt)}</span>
                    </div>
                    <div className="flex items-center">
                      <FiFileText size={14} className="mr-1" />
                      <span>{job.proposalsCount || 0} proposals</span>
                    </div>
                  </div>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Proposals List */}
        <div className="lg:col-span-2">
          {selectedJob ? (
            <>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Proposals for: {selectedJob.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  {proposals.length} proposal(s) received
                </p>
              </div>

              {proposalsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d97757]"></div>
                </div>
              ) : proposals.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <FiFileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No proposals received yet for this job.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => (
                    <div key={proposal.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <FiUser size={20} className="text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">
                              {proposal.developer?.name || 'Developer'}
                            </h4>
                            <div className="flex items-center text-sm text-gray-600">
                              <FiStar size={14} className="mr-1 text-yellow-500" />
                              <span>{Number(proposal.developer?.rating || 0).toFixed(1)}</span>
                              <span className="mx-2">•</span>
                              <FiMapPin size={14} className="mr-1" />
                              <span>{proposal.developer?.location || 'Remote'}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Proposed Budget
                          </label>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatBudget(proposal.proposedBudget, selectedJob.budgetType)}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Timeline
                          </label>
                          <p className="text-gray-900">{proposal.proposedTimeline}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Submitted
                          </label>
                          <p className="text-gray-900">{formatDate(proposal.createdAt)}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cover Letter
                        </label>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {proposal.coverLetter.length > 200
                            ? `${proposal.coverLetter.substring(0, 200)}...`
                            : proposal.coverLetter}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => openProposalModal(proposal)}
                          className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiEye size={16} className="mr-2" />
                          View Details
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProposalForFeedback(proposal);
                            setShowFeedbackModal(true);
                          }}
                          className="flex items-center px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <FiMessageSquare size={16} className="mr-2" />
                          Feedback
                        </button>

                        {proposal.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleProposalAction(proposal.id, 'accepted')}
                              disabled={actionLoading}
                              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              <FiCheck size={16} className="mr-2" />
                              Accept
                            </button>
                            <button
                              onClick={() => handleProposalAction(proposal.id, 'rejected')}
                              disabled={actionLoading}
                              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                              <FiX size={16} className="mr-2" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FiFileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Select a job to view its proposals</p>
            </div>
          )}
        </div>
      </div>

      {/* Proposal Details Modal */}
      {showProposalModal && selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Proposal Details
                  </h3>
                  <p className="text-gray-600">
                    From: {selectedProposal.developer?.name || 'Developer'}
                  </p>
                </div>
                <button
                  onClick={closeProposalModal}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Developer
                    </label>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <FiUser size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedProposal.developer?.name || 'Developer'}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <FiStar size={12} className="mr-1 text-yellow-500" />
                          <span>{Number(selectedProposal.developer?.rating || 0).toFixed(1)} rating</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level
                    </label>
                    <p className="text-gray-900">
                      {selectedProposal.developer?.experienceLevel || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <p className="text-gray-900">
                      {selectedProposal.developer?.location || 'Remote'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proposed Budget
                    </label>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatBudget(selectedProposal.proposedBudget, selectedJob?.budgetType)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proposed Timeline
                    </label>
                    <p className="text-gray-900">{selectedProposal.proposedTimeline}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <span className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(selectedProposal.status)}`}>
                      {selectedProposal.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Submitted
                    </label>
                    <p className="text-gray-900">{formatDate(selectedProposal.createdAt)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedProposal.coverLetter}
                  </p>
                </div>
              </div>

              {selectedProposal.developer?.skills && selectedProposal.developer.skills.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProposal.developer.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedProposal.status === 'pending' && (
                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleProposalAction(selectedProposal.id, 'rejected');
                      closeProposalModal();
                    }}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <FiX size={16} className="inline mr-2" />
                    Reject Proposal
                  </button>
                  <button
                    onClick={() => {
                      handleProposalAction(selectedProposal.id, 'accepted');
                      closeProposalModal();
                    }}
                    disabled={actionLoading}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <FiCheck size={16} className="inline mr-2" />
                    Accept Proposal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedProposalForFeedback && (
        <FeedbackSystem
          proposalId={selectedProposalForFeedback.id}
          onClose={() => {
            setShowFeedbackModal(false);
            setSelectedProposalForFeedback(null);
          }}
        />
      )}
    </div>
  );
};

export default UserProposals;
