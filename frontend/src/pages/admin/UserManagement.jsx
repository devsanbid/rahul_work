import React, { useState } from 'react';
import UserHeader from '../../component/users/UserHeader';
import UserFilters from '../../component/users/UserFilters';
import UserStats from '../../component/users/UserStats';
import UserTable from '../../component/users/UserTable';

const UserManagementPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <UserHeader onUserAdded={handleUserAdded} />
      <UserFilters />
      <UserStats key={`stats-${refreshTrigger}`} />
      <UserTable key={`table-${refreshTrigger}`} />
    </div>
  );
};

export default UserManagementPage;