import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddUserModal from './AddUserModal';

const UserHeader = ({ onUserAdded }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleUserAdded = () => {
    if (onUserAdded) {
      onUserAdded();
    }
    setShowAddModal(false);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600 mt-1">Manage all users and their permissions</p>
        </div>
        <button 
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 bg-[#d97757] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#c86a4a] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add User</span>
        </button>
      </div>
      
      <AddUserModal 
        isOpen={showAddModal}
        onClose={handleCloseModal}
        onUserAdded={handleUserAdded}
      />
    </>
  );
};

export default UserHeader;