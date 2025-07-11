import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';

const FinancialCharts = ({ monthlyData, paymentMethods }) => {
  const defaultMonthlyData = [
    { month: 'Jan', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Feb', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Mar', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Apr', revenue: 0, expenses: 0, profit: 0 },
    { month: 'May', revenue: 0, expenses: 0, profit: 0 },
    { month: 'Jun', revenue: 0, expenses: 0, profit: 0 }
  ];

  const defaultPaymentMethods = [
    { method: 'Bank Transfer', amount: 0, percentage: 0 },
    { method: 'PayPal', amount: 0, percentage: 0 },
    { method: 'Credit Card', amount: 0, percentage: 0 }
  ];

  const chartMonthlyData = monthlyData || defaultMonthlyData;
  const chartPaymentMethods = paymentMethods || defaultPaymentMethods;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Revenue vs Expenses</h3>
          <BarChart3 className="w-5 h-5 text-gray-500" />
        </div>
        <div className="h-48 sm:h-64">
          <div className="h-full flex items-end justify-between space-x-2">
            {chartMonthlyData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div 
                    className="w-4 sm:w-6 bg-[#d97757] rounded-t"
                    style={{ height: `${(data.revenue / 30000) * 120}px` }}
                  ></div>
                  <div 
                    className="w-4 sm:w-6 bg-red-400 rounded-t"
                    style={{ height: `${(data.expenses / 30000) * 120}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#d97757] rounded"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-sm text-gray-600">Expenses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <PieChart className="w-5 h-5 text-gray-500" />
        </div>
        <div className="space-y-3">
          {chartPaymentMethods.map((method, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-[#d97757]" style={{ 
                  backgroundColor: index === 0 ? '#d97757' : index === 1 ? '#3b82f6' : '#10b981' 
                }}></div>
                <span className="text-sm font-medium text-gray-900">{method.method}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">${method.amount.toLocaleString()}</p>
                <p className="text-xs text-gray-500">{method.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full flex">
            <div className="bg-[#d97757] h-full" style={{ width: '65%' }}></div>
            <div className="bg-blue-500 h-full" style={{ width: '26%' }}></div>
            <div className="bg-green-500 h-full" style={{ width: '9%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialCharts;