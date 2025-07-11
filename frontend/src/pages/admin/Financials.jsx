import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import FinancialHeader from '../../component/financials/FinancialHeader';
import FinancialStats from '../../component/financials/FinancialStats';
import FinancialCharts from '../../component/financials/FinancialCharts';
import AdditionalStats from '../../component/financials/AdditionalStats';
import TransactionTable from '../../component/financials/TransactionTable';

const FinancialsPage = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getFinancialData({ period: selectedPeriod });
      setFinancialData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching financial data:', err);
      setError('Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  const handleExportReport = () => {
    // Implement export functionality
    alert('Export functionality will be implemented');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97757]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchFinancialData}
            className="mt-4 px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-orange-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FinancialHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onExportReport={handleExportReport}
      />
      <FinancialStats data={financialData?.financialStats} />
      <FinancialCharts 
        monthlyData={financialData?.monthlyData}
        paymentMethods={financialData?.paymentMethods}
      />
      <AdditionalStats data={financialData?.additionalStats} />
      <TransactionTable transactions={financialData?.recentTransactions} />
    </div>
  );
};

export default FinancialsPage;