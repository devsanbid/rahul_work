import React from 'react';
import { DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';

const FinancialStats = ({ data }) => {
  const financialStats = data || {
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalExpenses: 0,
    netProfit: 0
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${financialStats.totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from last month
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-green-100 rounded-full">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${financialStats.monthlyRevenue.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.3% from last month
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-[#d97757] bg-opacity-20 rounded-full">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-[#d97757]" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${financialStats.totalExpenses.toLocaleString()}</p>
            <p className="text-sm text-red-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +3.2% from last month
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-red-100 rounded-full">
            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Profit</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">${financialStats.netProfit.toLocaleString()}</p>
            <p className="text-sm text-green-600 flex items-center mt-1">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.7% from last month
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-blue-100 rounded-full">
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStats;