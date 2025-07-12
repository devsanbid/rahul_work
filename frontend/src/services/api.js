import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

export const jobAPI = {
  getAllJobs: (params) => api.get('/jobs', { params }),
  getJobById: (id) => api.get(`/jobs/${id}`),
  createJob: (jobData) => api.post('/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyJobs: () => api.get('/jobs/my-jobs'),
};

export const proposalAPI = {
  createProposal: (jobId, proposalData) => api.post(`/jobs/${jobId}/proposals`, proposalData),
  getJobProposals: (jobId) => api.get(`/jobs/${jobId}/proposals`),
  getMyProposals: (status) => api.get('/jobs/proposals/my-proposals', { params: { status } }),
  updateProposalStatus: (proposalId, status) => api.put(`/jobs/proposals/${proposalId}/status`, { status }),
  withdrawProposal: (proposalId) => api.delete(`/jobs/proposals/${proposalId}`),
  markProposalCompleted: (proposalId) => api.put(`/jobs/proposals/${proposalId}/complete`)
};

export const feedbackAPI = {
  createFeedback: (feedbackData) => api.post('/users/feedback', feedbackData),
  createDeveloperFeedback: (feedbackData) => api.post('/developer/feedback', feedbackData),
  getProposalFeedbacks: (proposalId, userType = 'user') => api.get(`/${userType}/proposals/${proposalId}/feedback`),
  getUserFeedbacks: (userType = 'user', type = 'all') => api.get(`/${userType}/feedback`, { params: { type } }),
  markFeedbackAsRead: (feedbackId, userType = 'user') => api.put(`/${userType}/feedback/${feedbackId}/read`)
};

export const userAPI = {
  getDashboard: () => api.get('/users/dashboard'),
  getMyJobs: () => api.get('/users/jobs'),
  getMyProjects: () => api.get('/users/projects'),
  getMyPayments: () => api.get('/users/payments'),
  getNotifications: (userId) => api.get('/users/notifications', { params: { userId } }),
  markNotificationAsRead: (id, userId) => api.put(`/users/notifications/${id}/read`, {}, { params: { userId } }),
  markAllNotificationsAsRead: (userId) => api.put('/users/notifications/read-all', {}, { params: { userId } }),
  deleteNotification: (id, userId) => api.delete(`/users/notifications/${id}`, { params: { userId } }),
  getDevelopers: (params) => api.get('/users/developers', { params }),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  hireDeveloper: (data) => api.post('/users/hire-developer', data),
  getMyJobRequests: (params) => api.get('/users/job-requests', { params }),
  getBalance: () => api.get('/users/balance'),
  topUpBalance: (amount) => api.post('/users/balance/topup', { amount }),
  createReview: (reviewData) => api.post('/users/reviews', reviewData),
  getHiredDevelopers: () => api.get('/users/hired-developers'),
  markProjectCompleted: (projectId) => api.put(`/users/projects/${projectId}/complete`),
  getMyProjects: () => api.get('/users/projects'),
};

export const developerAPI = {
  getDashboard: () => api.get('/developer/dashboard'),
  getAvailableJobs: (params) => api.get('/developer/jobs', { params }),
  getMyProjects: () => api.get('/developer/projects'),
  getMyProposals: () => api.get('/developer/proposals'),
  getEarnings: (params) => api.get('/developer/earnings', { params }),
  createWithdrawal: (withdrawalData) => api.post('/developer/withdrawals', withdrawalData),
  getWithdrawals: (params) => api.get('/developer/withdrawals', { params }),
  updateProjectProgress: (projectId, progress) => api.put(`/developer/projects/${projectId}/progress`, { progress }),
  getMyReviews: () => api.get('/developer/reviews'),
  getJobRequests: (params) => api.get('/developer/job-requests', { params }),
  updateJobRequestStatus: (requestId, status) => api.put(`/developer/job-requests/${requestId}/status`, { status }),
  getNotifications: (params) => api.get('/developer/notifications', { params }),
  markNotificationAsRead: (id, userId) => api.put(`/developer/notifications/${id}/read`, {}, { params: { userId } }),
  markAllNotificationsAsRead: (userId) => api.put('/developer/notifications/read-all', {}, { params: { userId } }),
  deleteNotification: (id, userId) => api.delete(`/developer/notifications/${id}`, { params: { userId } }),
  getProfile: () => api.get('/developer/profile'),
  updateProfile: (profileData) => api.put('/developer/profile', profileData),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getDashboardStats: () => api.get('/admin/dashboard'), // Alias for backward compatibility
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserById: (userId) => api.get(`/admin/users/${userId}`),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getAllJobs: (params) => api.get('/admin/jobs', { params }),
  getFinancialData: (params) => api.get('/admin/financials', { params }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settingsData) => api.put('/admin/settings', settingsData),
  updatePassword: (passwordData) => api.put('/admin/settings/password', passwordData),
  getAdminEarnings: (params) => api.get('/admin/earnings', { params }),
  updateEarningStatus: (earningId, status) => api.put(`/admin/earnings/${earningId}/status`, { status }),
  getWithdrawalEarnings: () => api.get('/admin/withdrawal-earnings')
};


export default api;
