import React from 'react';
import { Download } from 'lucide-react';

const FinancialHeader = ({ selectedPeriod, onPeriodChange, onExportReport }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Dashboard</h2>
        <p className="text-gray-600 mt-1">Track revenue, expenses, and financial performance</p>
      </div>
      <div className="flex items-center space-x-3 mt-4 sm:mt-0">
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
          value={selectedPeriod}
          onChange={(e) => onPeriodChange(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button 
          onClick={onExportReport}
          className="bg-[#d97757] text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#c86a4a] transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
};

export default FinancialHeader;