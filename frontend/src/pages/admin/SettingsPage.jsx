import React from 'react';
import SettingsNavigation from '../../component/settings/SettingNavigation';
import SettingsContent from '../../component/settings/SettingsContent';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* <SettingsNavigation /> */}
        <SettingsContent />
      </div>
    </div>
  );
};

export default SettingsPage;