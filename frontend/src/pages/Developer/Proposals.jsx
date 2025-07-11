import React, { useState, useEffect } from 'react';
import {
  FiFileText,
  FiUser,
  FiDollarSign,
  FiClock,
  FiCalendar,
  FiEye,
  FiCheck,
  FiX,
  FiStar,
  FiMapPin,
  FiLoader
} from 'react-icons/fi';
import { proposalAPI } from '../../services/api';

const DeveloperProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProposals();
  }, [activeFilter]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);
      const status = activeFilter === 'all' ? undefined : activeFilter;
      const response = await proposalAPI.getMyProposals(status);
      setProposals(response.data.proposals || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (proposalId) => {
    try {
      setActionLoading(true);
      await proposalAPI.markProposalCompleted(proposalId);
      await fetchProposals();
      setShowModal(false);
      setSelectedProposal(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark proposal as completed');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (budget, budgetType) => {
    if (budgetType === 'hourly') {
      return `$${budget}/hr`;
    }
    return `$${budget}`;
  };

  const getProposalCounts = () => {
    return {
      all: proposals.length,
      pending: proposals.filter(p => p.status === 'pending').length,
      accepted: proposals.filter(p => p.status === 'accepted').length,
      rejected: proposals.filter(p => p.status === 'rejected').length,
      completed: proposals.filter(p => p.status === 'completed').length
    };
  };

  const filteredProposals = activeFilter === 'all'
    ? proposals
    : proposals.filter(proposal => proposal.status === activeFilter);

  const counts = getProposalCounts();

  const openModal = (proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };

  const messageHandler = async (prospoal) => {
    const response = await proposalAPI.sendMessage("1", message)
    console.log(response.data)
    if (response.data.success) {
      alert(response.data.message)
    } else {
      alert(response.data.message)
    }
  }

  const closeModal = () => {
    setShowModal(false);
    setSelectedProposal(null);
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
          My Proposals
        </h2>
        <p className="text-gray-600">
          Track and manage your submitted proposals
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap border-b border-gray-200">
          {[
            { key: 'all', label: 'All Proposals', count: counts.all },
            { key: 'pending', label: 'Pending', count: counts.pending },
            { key: 'accepted', label: 'Accepted', count: counts.accepted },
            { key: 'completed', label: 'Completed', count: counts.completed },
            { key: 'rejected', label: 'Rejected', count: counts.rejected }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeFilter === filter.key
                ? 'border-[#d97757] text-[#d97757] bg-orange-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

      <div className="grid gap-6">
        {filteredProposals.length > 0 ? (
          filteredProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {proposal.job?.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <FiUser size={14} className="mr-1" />
                    <span className="mr-4">{proposal.job?.client?.name}</span>
                    <FiStar size={14} className="mr-1 text-yellow-500" />
                    <span className="mr-4">{Number(proposal.job?.client?.rating || 0).toFixed(1)}</span>
                    <FiCalendar size={14} className="mr-1" />
                    <span>Submitted {formatDate(proposal.createdAt)}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(proposal.status)}`}>
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Budget
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatBudget(proposal.proposedBudget, proposal.job?.budgetType)}
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
                    Job Budget
                  </label>
                  <p className="text-gray-900">
                    {formatBudget(proposal.job?.budget, proposal.job?.budgetType)}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {proposal.coverLetter.length > 150
                    ? `${proposal.coverLetter.substring(0, 150)}...`
                    : proposal.coverLetter}
                </p>
              </div>

              <div className='p-7'>
                <input onChange={e => setMessage(e.target.value)
                } className='border' placeholder='message......' />
                <button className='border p-2' onClick={() => messageHandler(proposal)}>send message</button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openModal(proposal)}
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FiEye size={16} className="mr-2" />
                  View Details
                </button>

                {proposal.status === 'accepted' && (
                  <button
                    onClick={() => handleMarkCompleted(proposal.id)}
                    disabled={actionLoading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <FiLoader size={16} className="mr-2 animate-spin" />
                    ) : (
                      <FiCheck size={16} className="mr-2" />
                    )}
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FiFileText size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {activeFilter === 'all'
                ? 'No proposals found'
                : `No ${activeFilter} proposals found`}
            </p>
          </div>
        )}
      </div>

      {showModal && selectedProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedProposal.job?.title}
                  </h3>
                  <div className="flex items-center text-gray-600">
                    <FiUser size={16} className="mr-2" />
                    <span className="mr-4">{selectedProposal.job?.client?.name}</span>
                    <FiStar size={16} className="mr-1 text-yellow-500" />
                    <span>{Number(selectedProposal.job?.client?.rating || 0).toFixed(1)} rating</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      Job Description
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedProposal.job?.description}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">
                      My Cover Letter
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">
                        {selectedProposal.coverLetter}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      Proposal Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Status</span>
                        <p className="text-gray-900">
                          <span className={`inline-block px-3 py-1 text-sm rounded-full ${getStatusColor(selectedProposal.status)}`}>
                            {selectedProposal.status.charAt(0).toUpperCase() + selectedProposal.status.slice(1)}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Proposed Budget</span>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatBudget(selectedProposal.proposedBudget, selectedProposal.job?.budgetType)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Job Budget</span>
                        <p className="text-gray-900">
                          {formatBudget(selectedProposal.job?.budget, selectedProposal.job?.budgetType)}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Timeline</span>
                        <p className="text-gray-900">{selectedProposal.proposedTimeline}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Submitted</span>
                        <p className="text-gray-900">{formatDate(selectedProposal.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  {selectedProposal.status === 'accepted' && (
                    <button
                      onClick={() => handleMarkCompleted(selectedProposal.id)}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <FiLoader size={16} className="mr-2 animate-spin" />
                      ) : (
                        <FiCheck size={16} className="mr-2" />
                      )}
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeveloperProposals;
