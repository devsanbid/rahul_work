import React, { useState, useEffect } from 'react';
import {
  FiMessageSquare,
  FiStar,
  FiSend,
  FiUser,
  FiClock,
  FiCheck,
  FiX,
  FiLoader
} from 'react-icons/fi';
import { feedbackAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FeedbackSystem = ({ proposalId, onClose }) => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('message');
  const [rating, setRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userType = user?.role === 'developer' ? 'developer' : 'user';

  useEffect(() => {
    fetchFeedbacks();
  }, [proposalId]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getProposalFeedbacks(proposalId, userType);
      setFeedbacks(response.data.feedbacks || []);
    } catch (err) {
      setError('Failed to load feedbacks');
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    if (feedbackType === 'review' && rating === 0) {
      setError('Please provide a rating for the review');
      return;
    }

    try {
      setSending(true);
      setError('');
      
      const feedbackData = {
        proposalId: parseInt(proposalId),
        message: newMessage.trim(),
        feedbackType,
        ...(feedbackType === 'review' && { rating })
      };

      const createFeedbackFn = userType === 'developer' 
        ? feedbackAPI.createDeveloperFeedback 
        : feedbackAPI.createFeedback;

      await createFeedbackFn(feedbackData);
      
      setNewMessage('');
      setRating(0);
      setFeedbackType('message');
      setSuccess('Feedback sent successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
      
      await fetchFeedbacks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send feedback');
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating, interactive = false, onStarClick = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            size={16}
            className={`${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive ? () => onStarClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center justify-center">
            <FiLoader className="animate-spin mr-2" size={24} />
            <span>Loading feedbacks...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-3">
            <FiMessageSquare className="text-blue-600" size={24} />
            <h3 className="text-xl font-semibold text-gray-800">Proposal Feedback</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          <div className="space-y-4 mb-6">
            {feedbacks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiMessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No feedback yet. Start the conversation!</p>
              </div>
            ) : (
              feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className={`p-4 rounded-lg border ${
                    feedback.senderId === user.id
                      ? 'bg-blue-50 border-blue-200 ml-8'
                      : 'bg-gray-50 border-gray-200 mr-8'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <FiUser size={14} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {feedback.sender.name}
                          {feedback.senderId === user.id && ' (You)'}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <FiClock size={12} />
                          <span>{formatDate(feedback.createdAt)}</span>
                          {feedback.feedbackType === 'review' && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <span>Review:</span>
                                {renderStars(feedback.rating)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {feedback.feedbackType === 'review' && (
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        Review
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border-t p-6">
          <form onSubmit={handleSendFeedback} className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="message"
                  checked={feedbackType === 'message'}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Message</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="review"
                  checked={feedbackType === 'review'}
                  onChange={(e) => setFeedbackType(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm font-medium text-gray-700">Review</span>
              </label>
            </div>

            {feedbackType === 'review' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <div className="flex items-center space-x-2">
                  {renderStars(rating, true, setRating)}
                  <span className="text-sm text-gray-500 ml-2">
                    {rating > 0 ? `${rating}/5` : 'Click to rate'}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {feedbackType === 'review' ? 'Review Comment' : 'Message'}
              </label>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Write your ${feedbackType}...`}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={sending}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={sending}
              >
                Close
              </button>
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <FiLoader className="animate-spin mr-2" size={16} />
                ) : (
                  <FiSend className="mr-2" size={16} />
                )}
                Send {feedbackType === 'review' ? 'Review' : 'Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackSystem;