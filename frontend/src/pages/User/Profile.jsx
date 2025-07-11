import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon, UserIcon, EnvelopeIcon, PhoneIcon, BuildingOfficeIcon, MapPinIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    location: '',
    bio: '',
    website: '',
    linkedin: '',
    timezone: 'America/New_York'
  });

  const [tempData, setTempData] = useState(profileData);

  const [stats, setStats] = useState([
    { label: 'Projects Posted', value: '0' },
    { label: 'Active Projects', value: '0' },
    { label: 'Total Spent', value: '$0' },
    { label: 'Success Rate', value: '0%' }
  ]);

  useEffect(() => {
    fetchProfile();
    fetchDashboardStats();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      const userData = response.data.user;
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        location: userData.location || '',
        bio: userData.bio || '',
        website: userData.website || '',
        linkedin: userData.linkedin || '',
        timezone: userData.timezone || 'America/New_York'
      });
      setTempData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        location: userData.location || '',
        bio: userData.bio || '',
        website: userData.website || '',
        linkedin: userData.linkedin || '',
        timezone: userData.timezone || 'America/New_York'
      });
    } catch (err) {
      setError('Failed to fetch profile data');
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await userAPI.getDashboard();
      const { stats: dashboardStats } = response.data;
      setStats([
        { label: 'Projects Posted', value: dashboardStats.postedJobs?.toString() || '0' },
        { label: 'Active Projects', value: dashboardStats.activeProjects?.toString() || '0' },
        { label: 'Total Spent', value: `$${dashboardStats.totalSpent?.toLocaleString() || '0'}` },
        { label: 'Member Since', value: new Date(authUser?.createdAt || Date.now()).getFullYear().toString() }
      ]);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(profileData);
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await userAPI.updateProfile(tempData);
      setProfileData(tempData);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d97757]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Error/Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-40 bg-gradient-to-r from-[#d97757] via-[#e08968] to-[#c86a4a] relative">
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>
            <div className="absolute bottom-4 left-6 text-white">
              <h1 className="text-3xl font-bold">{profileData.name || 'User Profile'}</h1>
              <p className="text-lg opacity-90">{profileData.company || 'Professional'}</p>
            </div>
          </div>
          
          {/* Profile Content */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-5">
              {/* Avatar */}
              <div className="relative -mt-16 sm:-mt-20">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#d97757] to-[#c86a4a] rounded-full flex items-center justify-center">
                    <UserIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="mt-6 sm:mt-0 flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <EnvelopeIcon className="w-4 h-4" />
                      <span className="text-sm">{profileData.email}</span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <PhoneIcon className="w-4 h-4" />
                        <span className="text-sm">{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.location && (
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPinIcon className="w-4 h-4" />
                        <span className="text-sm">{profileData.location}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Edit Button */}
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="mt-4 sm:mt-0 flex items-center px-6 py-3 bg-[#d97757] text-white rounded-lg hover:bg-[#c86a4a] transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-3 mt-4 sm:mt-0">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckIcon className="w-5 h-5 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XMarkIcon className="w-5 h-5 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="text-2xl font-bold text-[#d97757] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center">
            <UserIcon className="w-6 h-6 mr-3 text-[#d97757]" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <UserIcon className="w-4 h-4 mr-2 text-gray-500" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={isEditing ? tempData.name : profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <EnvelopeIcon className="w-4 h-4 mr-2 text-gray-500" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={isEditing ? tempData.email : profileData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <PhoneIcon className="w-4 h-4 mr-2 text-gray-500" />
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={isEditing ? tempData.phone : profileData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BuildingOfficeIcon className="w-4 h-4 mr-2 text-gray-500" />
                Company
              </label>
              <input
                type="text"
                name="company"
                value={isEditing ? tempData.company : profileData.company}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={isEditing ? tempData.location : profileData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="Enter your location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select
                name="timezone"
                value={isEditing ? tempData.timezone : profileData.timezone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <GlobeAltIcon className="w-4 h-4 mr-2 text-gray-500" />
                Website
              </label>
              <input
                type="url"
                name="website"
                value={isEditing ? tempData.website : profileData.website}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                value={isEditing ? tempData.linkedin : profileData.linkedin}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 ${
                  isEditing 
                    ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                    : 'bg-gray-50 cursor-not-allowed'
                }`}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              name="bio"
              rows={4}
              value={isEditing ? tempData.bio : profileData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg transition-all duration-200 resize-none ${
                isEditing 
                  ? 'focus:ring-2 focus:ring-[#d97757] focus:border-transparent hover:border-[#d97757]' 
                  : 'bg-gray-50 cursor-not-allowed'
              }`}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-8 flex items-center">
            <svg className="w-6 h-6 mr-3 text-[#d97757]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Security Settings
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:border-[#d97757] transition-all duration-200 hover:shadow-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                </div>
              </div>
              <button className="px-6 py-2 text-sm font-medium text-[#d97757] border border-[#d97757] rounded-lg hover:bg-[#d97757] hover:text-white transition-all duration-200 hover:shadow-md">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between p-6 border border-gray-200 rounded-lg hover:border-[#d97757] transition-all duration-200 hover:shadow-md">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
              </div>
              <button className="px-6 py-2 text-sm font-medium text-[#d97757] border border-[#d97757] rounded-lg hover:bg-[#d97757] hover:text-white transition-all duration-200 hover:shadow-md">
                Enable
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
