import React, { useState, useEffect } from 'react';
import { StarIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, CheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { HeartIcon, ChatBubbleLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const HireDeveloper = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [priceRange, setPriceRange] = useState('all');
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalDevelopers: 0
  });
  const [showHireModal, setShowHireModal] = useState(false);
  const [selectedDeveloper, setSelectedDeveloper] = useState(null);
  const [hireForm, setHireForm] = useState({
    jobTitle: '',
    description: '',
    budget: '',
    deadline: ''
  });
  const [hiring, setHiring] = useState(false);
  const [hireSuccess, setHireSuccess] = useState(false);
  const [hireError, setHireError] = useState('');
  const [hiredDevelopers, setHiredDevelopers] = useState(new Set());
  const [jobRequestStatuses, setJobRequestStatuses] = useState(new Map());
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDeveloperForReview, setSelectedDeveloperForReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [markingComplete, setMarkingComplete] = useState(new Set());
  const [showProjects, setShowProjects] = useState(false);

  const skills = ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'];

  useEffect(() => {
    fetchDevelopers();
    fetchHiredDevelopers();
  }, [searchTerm, selectedSkills, priceRange]);

  // Set up periodic polling to check for status updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchHiredDevelopers();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchHiredDevelopers = async () => {
    try {
      // Fetch both pending and accepted job requests to show proper status
      const [pendingResponse, acceptedResponse] = await Promise.all([
        userAPI.getMyJobRequests({ status: 'pending' }),
        userAPI.getMyJobRequests({ status: 'accepted' })
      ]);
      
      const statusMap = new Map();
      const allHiredDevIds = [];
      
      // Process pending requests
      pendingResponse.data.jobRequests.forEach(req => {
        statusMap.set(req.developerId, 'pending');
        allHiredDevIds.push(req.developerId);
      });
      
      // Process accepted requests
      acceptedResponse.data.jobRequests.forEach(req => {
        statusMap.set(req.developerId, 'accepted');
        allHiredDevIds.push(req.developerId);
      });
      
      setHiredDevelopers(new Set(allHiredDevIds));
      setJobRequestStatuses(statusMap);
    } catch (err) {
      console.error('Error fetching hired developers:', err);
    }
  };

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: 1,
        limit: 12,
        search: searchTerm || undefined,
        skills: selectedSkills.length > 0 ? selectedSkills.join(',') : undefined,
      };

      // Handle price range filtering
      if (priceRange === 'low') {
        params.maxRate = 40;
      } else if (priceRange === 'medium') {
        params.minRate = 40;
        params.maxRate = 60;
      } else if (priceRange === 'high') {
        params.minRate = 60;
      }

      const response = await userAPI.getDevelopers(params);
      setDevelopers(response.data.developers);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Failed to fetch developers');
      console.error('Error fetching developers:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleHireClick = (developer) => {
    setSelectedDeveloper(developer);
    setHireForm({
      jobTitle: '',
      description: '',
      budget: '',
      deadline: ''
    });
    setHireError('');
    setShowHireModal(true);
  };

  const handleHireFormChange = (e) => {
    const { name, value } = e.target;
    setHireForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    
    if (!hireForm.jobTitle || !hireForm.description || !hireForm.budget) {
      setHireError('Please fill in all required fields');
      return;
    }

    try {
      setHiring(true);
      setHireError('');
      
      const hireData = {
        developerId: selectedDeveloper.id,
        jobTitle: hireForm.jobTitle,
        description: hireForm.description,
        budget: parseFloat(hireForm.budget),
        deadline: hireForm.deadline || null
      };

      await userAPI.hireDeveloper(hireData);
      
      setHiredDevelopers(prev => new Set([...prev, selectedDeveloper.id]));
      setJobRequestStatuses(prev => new Map(prev).set(selectedDeveloper.id, 'pending'));
      setHireSuccess(true);
      setShowHireModal(false);
      
      setTimeout(() => {
        setHireSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error hiring developer:', err);
      setHireError(err.response?.data?.message || 'Failed to hire developer');
    } finally {
      setHiring(false);
    }
  };

  const closeHireModal = () => {
    setShowHireModal(false);
    setSelectedDeveloper(null);
    setHireForm({
      jobTitle: '',
      description: '',
      budget: '',
      deadline: ''
    });
    setHireError('');
  };

  const handleReviewClick = async (developer) => {
    try {
      // Fetch completed projects with this developer
      const response = await userAPI.getHiredDevelopers();
      const projectsWithDev = response.data.developersToReview.filter(
        item => item.developer.id === developer.id && !item.hasReviewed
      );
      
      if (projectsWithDev.length === 0) {
        setReviewError('No completed projects found with this developer or already reviewed.');
        return;
      }
      
      setSelectedDeveloperForReview(developer);
      setCompletedProjects(projectsWithDev);
      setReviewForm({ rating: 5, comment: '' });
      setReviewError('');
      setShowReviewModal(true);
    } catch (err) {
      console.error('Error fetching completed projects:', err);
      setReviewError('Failed to load project information.');
    }
  };

  const handleReviewFormChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewError('Please provide a rating between 1 and 5');
      return;
    }

    if (completedProjects.length === 0) {
      setReviewError('No project selected for review');
      return;
    }

    try {
      setSubmittingReview(true);
      setReviewError('');
      
      const reviewData = {
        developerId: selectedDeveloperForReview.id,
        projectId: completedProjects[0].projectId, // Use the first completed project
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment
      };

      await userAPI.createReview(reviewData);
      
      setReviewSuccess(true);
      setShowReviewModal(false);
      
      setTimeout(() => {
        setReviewSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting review:', err);
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedDeveloperForReview(null);
    setReviewForm({ rating: 5, comment: '' });
    setReviewError('');
    setCompletedProjects([]);
  };

  const fetchMyProjects = async () => {
    try {
      setLoadingProjects(true);
      const response = await userAPI.getMyProjects();
      setMyProjects(response.data.projects);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleMarkCompleted = async (projectId) => {
    try {
      setMarkingComplete(prev => new Set([...prev, projectId]));
      await userAPI.markProjectCompleted(projectId);
      
      // Update the project status locally
      setMyProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, status: 'completed' }
          : project
      ));
      
      // Show success message
      setHireSuccess(true);
      setTimeout(() => {
        setHireSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('Error marking project as completed:', err);
      setHireError(err.response?.data?.message || 'Failed to mark project as completed');
      setTimeout(() => {
        setHireError('');
      }, 5000);
    } finally {
      setMarkingComplete(prev => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const toggleProjectsView = () => {
    setShowProjects(!showProjects);
    if (!showProjects && myProjects.length === 0) {
      fetchMyProjects();
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {showProjects ? 'My Projects' : 'Hire Developers'}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={toggleProjectsView}
              className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                showProjects 
                  ? 'bg-[#d97757] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {showProjects ? 'View Developers' : 'My Projects'}
            </button>
            {!showProjects && (
              <button
                onClick={fetchHiredDevelopers}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Refresh Status
              </button>
            )}
          </div>
        </div>
        
        {/* Search and Filters */}
        {!showProjects && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search developers, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
              >
                <option value="all">All Prices</option>
                <option value="low">Under $40/hr</option>
                <option value="medium">$40-60/hr</option>
                <option value="high">$60+/hr</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 5).map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedSkills.includes(skill)
                        ? 'bg-[#d97757] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Projects View */}
      {showProjects && (
        <div>
          {/* Loading State for Projects */}
          {loadingProjects && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97757]"></div>
            </div>
          )}

          {/* Projects Grid */}
          {!loadingProjects && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-600">with {project.developer?.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'active' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'completed' ? 'bg-green-100 text-green-800' :
                      project.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="w-4 h-4 mr-1" />
                      ${project.budget}
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#d97757] rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {project.developer?.name?.split(' ').map(n => n[0]).join('') || 'D'}
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center">
                          <StarIcon className="w-3 h-3 text-yellow-400" />
                          <span className="ml-1 text-xs">{project.developer?.rating || '0.0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {project.status === 'active' && (
                      <button
                        onClick={() => handleMarkCompleted(project.id)}
                        disabled={markingComplete.has(project.id)}
                        className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-medium ${
                          markingComplete.has(project.id)
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-[#d97757] text-white hover:bg-orange-600'
                        }`}
                      >
                        {markingComplete.has(project.id) ? (
                          <span className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Marking...
                          </span>
                        ) : (
                          'Mark as Completed'
                        )}
                      </button>
                    )}
                    {project.status === 'completed' && (
                      <button
                        onClick={() => handleReviewClick(project.developer)}
                        className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Write Review
                      </button>
                    )}
                    <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <ChatBubbleLeftIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loadingProjects && myProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No projects found.</p>
              <button
                onClick={toggleProjectsView}
                className="mt-4 px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Hire Developers
              </button>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {!showProjects && loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97757]"></div>
        </div>
      )}

      {/* Error State */}
      {!showProjects && error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchDevelopers}
            className="mt-2 text-red-700 hover:text-red-900 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Developers Grid */}
      {!showProjects && !loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {developers.map((developer) => (
          <div key={developer.id} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#d97757] rounded-full flex items-center justify-center text-white font-bold">
                  {developer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-gray-900">{developer.name}</h3>
                  <p className="text-sm text-gray-600">{developer.experienceLevel || 'Developer'}</p>
                </div>
              </div>
              {jobRequestStatuses.get(developer.id) === 'accepted' && (
                <button 
                  onClick={() => handleReviewClick(developer)}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium"
                >
                  Write Review
                </button>
              )}
            </div>

            <div className="flex items-center mb-3">
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-400" />
                <span className="ml-1 text-sm font-medium">{developer.rating || '0.0'}</span>
                <span className="ml-1 text-sm text-gray-500">({developer.totalProjects || 0} projects)</span>
              </div>
              <div className="ml-auto flex items-center text-sm text-gray-600">
                <MapPinIcon className="w-4 h-4 mr-1" />
                {developer.location || 'Remote'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div className="flex items-center">
                <CurrencyDollarIcon className="w-4 h-4 text-green-500 mr-1" />
                <span>${developer.hourlyRate || '0'}/hr</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 text-blue-500 mr-1" />
                <span className={`${developer.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                  {developer.status === 'active' ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{developer.bio || 'Experienced developer ready to work on your project.'}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {(developer.skills || []).slice(0, 4).map((skill) => (
                <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {skill}
                </span>
              ))}
              {(developer.skills || []).length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{(developer.skills || []).length - 4} more
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleHireClick(developer)}
                disabled={hiredDevelopers.has(developer.id)}
                className={`flex-1 py-2 px-4 rounded-lg transition-colors text-sm font-medium ${
                  hiredDevelopers.has(developer.id)
                    ? jobRequestStatuses.get(developer.id) === 'accepted'
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-yellow-600 text-white cursor-not-allowed'
                    : 'bg-[#d97757] text-white hover:bg-orange-600'
                }`}
              >
                {hiredDevelopers.has(developer.id) ? (
                  <span className="flex items-center justify-center">
                    {jobRequestStatuses.get(developer.id) === 'accepted' ? (
                      <>
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Hired
                      </>
                    ) : (
                      <>
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Request Pending
                      </>
                    )}
                  </span>
                ) : (
                  'Hire Now'
                )}
              </button>
              <button className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ChatBubbleLeftIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
        </div>
      )}

      {!showProjects && !loading && !error && developers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No developers found matching your criteria.</p>
        </div>
      )}

      {/* Success Messages */}
      {hireSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <CheckIcon className="h-5 w-5 mr-2" />
          {showProjects ? 'Project marked as completed successfully!' : 'Job request sent! Waiting for developer approval.'}
        </div>
      )}

      {reviewSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <CheckIcon className="h-5 w-5 mr-2" />
          Review submitted successfully!
        </div>
      )}

      {reviewError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          {reviewError}
          <button 
            onClick={() => setReviewError('')}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {hireError && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          {hireError}
          <button 
            onClick={() => setHireError('')}
            className="ml-2 text-white hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Hire Modal */}
      {showHireModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Hire {selectedDeveloper?.name}
                </h3>
                <button
                  onClick={closeHireModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {hireError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {hireError}
                </div>
              )}

              <form onSubmit={handleHireSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={hireForm.jobTitle}
                    onChange={handleHireFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter job title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={hireForm.description}
                    onChange={handleHireFormChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the project requirements"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget (USD) *
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={hireForm.budget}
                    onChange={handleHireFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter budget amount"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={hireForm.deadline}
                    onChange={handleHireFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeHireModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={hiring}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={hiring}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {hiring ? 'Hiring...' : 'Confirm Hire'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Review {selectedDeveloperForReview?.name}
                </h3>
                <button
                  onClick={closeReviewModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {reviewError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
                  {reviewError}
                </div>
              )}

              {completedProjects.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-800">
                    <strong>Project:</strong> {completedProjects[0].projectTitle}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Completed on {new Date(completedProjects[0].completedAt).toLocaleDateString()}
                  </p>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                        className={`text-2xl ${
                          star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:text-yellow-400 transition-colors`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment (Optional)
                  </label>
                  <textarea
                    name="comment"
                    value={reviewForm.comment}
                    onChange={handleReviewFormChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Share your experience working with this developer..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={submittingReview}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
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

export default HireDeveloper;
