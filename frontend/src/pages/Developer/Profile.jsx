import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiPlus,
  FiMapPin,
  FiMail,
  FiPhone,
  FiLoader,
} from "react-icons/fi";
import { useAuth } from '../../context/AuthContext';
import { developerAPI } from '../../services/api';

const DeveloperProfile = ({ developer: initialDeveloper }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [developer, setDeveloper] = useState(null);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const defaultDeveloper = {
    name: user?.name || 'Developer Name',
    email: user?.email || 'developer@example.com',
    title: 'Intermediate',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    hourlyRate: 50,
    availability: 'Available',
    bio: 'Experienced developer passionate about creating innovative solutions.',
    skills: ['JavaScript', 'React', 'Node.js', 'Python']
  };

  useEffect(() => {
    if (initialDeveloper) {
      setDeveloper(initialDeveloper);
      setFormData(initialDeveloper);
      setLoading(false);
    } else {
      fetchDeveloperProfile();
    }
  }, [initialDeveloper]);

  const fetchDeveloperProfile = async () => {
    try {
      setLoading(true);
      const response = await developerAPI.getProfile();
      const userData = response.data.user || response.data;
      
      const profileData = {
        ...defaultDeveloper,
        ...userData,
        title: userData.experienceLevel || defaultDeveloper.title,
        availability: userData.status === 'active' ? 'Available' : 'Unavailable'
      };
      
      setDeveloper(profileData);
      setFormData(profileData);
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setDeveloper(defaultDeveloper);
      setFormData(defaultDeveloper);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !(formData.skills || []).includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skill],
      }));
    }
  };

  const handleSkillRemove = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        experienceLevel: formData.title || formData.experienceLevel
      };
      
      delete updateData.title;
      delete updateData.availability;
      
      const response = await developerAPI.updateProfile(updateData);
      const updatedUser = response.data.user;
      
      const profileData = {
        ...updatedUser,
        title: updatedUser.experienceLevel || defaultDeveloper.title,
        availability: updatedUser.status === 'active' ? 'Available' : 'Unavailable'
      };
      
      setDeveloper(profileData);
      setFormData(profileData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(developer);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex justify-center items-center min-h-96">
        <div className="flex items-center space-x-2">
          <FiLoader className="animate-spin text-[#d97757]" size={24} />
          <span className="text-gray-600">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (!developer || !formData) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Failed to load profile data</p>
          <button
            onClick={fetchDeveloperProfile}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const SkillsSection = () => {
      const [newSkill, setNewSkill] = useState("");

      return (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {(formData.skills || []).map((skill, index) => (
            <div
              key={index}
              className="flex items-center bg-[#c0b7b4] bg-opacity-10 text-[#d97757] px-3 py-1 rounded-full"
            >
              <span className="text-sm font-medium">{skill}</span>
              {isEditing && (
                <button
                  onClick={() => handleSkillRemove(skill)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FiX size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
        {isEditing && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add new skill"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSkillAdd(newSkill);
                  setNewSkill("");
                }
              }}
            />
            <button
              onClick={() => {
                handleSkillAdd(newSkill);
                setNewSkill("");
              }}
              className="px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
            >
              <FiPlus size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Developer Profile
          </h2>
          <p className="text-gray-600">Manage your professional information</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FiX size={16} className="mr-2 inline" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
              >
                <FiSave size={16} className="mr-2 inline" />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
            >
              <FiEdit2 size={16} className="mr-2 inline" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-[#d97757] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">
                {(developer.name || "")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent text-center"
                />
                <select
                  value={formData.title || "Intermediate"}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent text-center"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-gray-800">
                  {developer.name || "Developer"}
                </h3>
                <p className="text-gray-600">{developer.title || "Software Developer"}</p>
              </>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <FiMail size={16} className="mr-3 flex-shrink-0" />
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                />
              ) : (
                <span className="break-all">{developer.email || ""}</span>
              )}
            </div>
            <div className="flex items-center text-gray-600">
              <FiPhone size={16} className="mr-3 flex-shrink-0" />
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                />
              ) : (
                <span>{developer.phone || "Not provided"}</span>
              )}
            </div>
            <div className="flex items-center text-gray-600">
              <FiMapPin size={16} className="mr-3 flex-shrink-0" />
              {isEditing ? (
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                />
              ) : (
                <span>{developer.location || "Not specified"}</span>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate ($)
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={formData.hourlyRate || 0}
                    onChange={(e) =>
                      handleInputChange("hourlyRate", parseInt(e.target.value) || 0)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-600">${developer.hourlyRate || 0}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                {isEditing ? (
                  <select
                    value={formData.availability || "Available"}
                    onChange={(e) =>
                      handleInputChange("availability", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                ) : (
                  <p
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      (developer.availability || "Available") === "Available"
                        ? "bg-green-100 text-green-800"
                        : (developer.availability || "Available") === "Busy"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {developer.availability || "Available"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Bio/Description */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              About Me
            </h3>
            {isEditing ? (
              <textarea
                value={formData.bio || ""}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell clients about yourself, your experience, and what makes you unique..."
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
              />
            ) : (
              <p className="text-gray-600">
                {developer.bio ||
                  "No bio added yet. Click edit to add your professional description."}
              </p>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
            <SkillsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperProfile;
