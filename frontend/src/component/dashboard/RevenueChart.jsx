import React, { useState, useEffect } from 'react';
import { BarChart3, PieChart, TrendingUp, TrendingDown } from 'lucide-react';
import { adminAPI } from '../../services/api';

const RevenueChart = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchRevenueData();
  }, [selectedPeriod]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFinancialData({ period: selectedPeriod });
      setRevenueData(response.data);
    } catch (err) {
      setError('Failed to fetch revenue data');
      console.error('Error fetching revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0">
            <BarChart3 className="w-5 h-5 text-gray-500" />
            <select className="text-sm border rounded-md px-2 py-1" value={selectedPeriod} onChange={handlePeriodChange}>
              <option value="weekly">Last 7 days</option>
              <option value="monthly">Last 30 days</option>
              <option value="yearly">Last 90 days</option>
            </select>
          </div>
        </div>
        <div className="h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
          <div className="text-center">
            <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-300 rounded-full mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <select 
            className="text-sm border rounded-md px-2 py-1" 
            value={selectedPeriod} 
            onChange={handlePeriodChange}
          >
            <option value="weekly">Last 7 days</option>
            <option value="monthly">Last 30 days</option>
            <option value="yearly">Last 90 days</option>
          </select>
        </div>
      </div>
      
      {error ? (
        <div className="h-48 sm:h-64 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center">
            <p className="text-red-600 text-sm sm:text-base">{error}</p>
          </div>
        </div>
      ) : revenueData ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">
                    ${revenueData.totalRevenue?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className={`p-2 rounded-full ${
                  revenueData.revenueChange >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {revenueData.revenueChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
              <p className={`text-sm mt-1 ${
                revenueData.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {revenueData.revenueChange >= 0 ? '+' : ''}{revenueData.revenueChange || 0}% from last period
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Transactions</p>
                  <p className="text-xl font-bold text-gray-900">
                    {revenueData.totalTransactions?.toLocaleString() || '0'}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-blue-100">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {revenueData.avgTransactionValue ? `Avg: $${revenueData.avgTransactionValue.toLocaleString()}` : 'No data'}
              </p>
            </div>
          </div>
          
          <div className="h-32 sm:h-40 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <PieChart className="w-8 sm:w-12 h-8 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 text-xs sm:text-sm">Detailed chart visualization coming soon</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-48 sm:h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <PieChart className="w-12 sm:w-16 h-12 sm:h-16 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm sm:text-base">No revenue data available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;