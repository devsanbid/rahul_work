import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiDownload, FiCreditCard, FiCalendar, FiCheck, FiLoader, FiClock } from 'react-icons/fi';
import { developerAPI } from '../../services/api';

const DeveloperPayments = () => {
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [showWithdrawalPopup, setShowWithdrawalPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);
  
  const [paymentData, setPaymentData] = useState({
    availableBalance: 0,
    pendingPayments: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
    monthlyGrowth: ''
  });

  const [transactions, setTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [periodFilter, setPeriodFilter] = useState('all');

  useEffect(() => {
    fetchEarningsData();
  }, [periodFilter]);

  const fetchEarningsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await developerAPI.getEarnings({ period: periodFilter });
      setPaymentData(response.data.summary);
      setTransactions(response.data.transactions);
    } catch (err) {
      setError('Failed to load earnings data');
      console.error('Error fetching earnings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawalClick = () => {
    setShowWithdrawalPopup(true);
  };

  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }

    if (parseFloat(withdrawalAmount) > paymentData.availableBalance) {
      alert('Insufficient balance');
      return;
    }

    try {
      setSubmittingWithdrawal(true);
      const withdrawalData = {
        amount: parseFloat(withdrawalAmount),
        paymentMethod: selectedPaymentMethod
      };

      const response = await developerAPI.createWithdrawal(withdrawalData);
      
      // Show success message with fee information
      const adminFee = response.data.withdrawal.adminFee;
      const netAmount = response.data.withdrawal.netAmount;
      alert(`Withdrawal request submitted successfully!\nOriginal Amount: $${withdrawalAmount}\nAdmin Fee (10%): $${adminFee.toFixed(2)}\nNet Amount: $${netAmount.toFixed(2)}`);
      
      setWithdrawalAmount('');
      setShowWithdrawalForm(false);
      setShowWithdrawalPopup(false);
      fetchEarningsData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit withdrawal request');
      console.error('Error creating withdrawal:', err);
    } finally {
      setSubmittingWithdrawal(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (transactionFilter === 'all') return true;
    if (transactionFilter === 'payments') return transaction.type === 'payment';
    if (transactionFilter === 'withdrawals') return transaction.type === 'withdrawal';
    return true;
  });

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mt-1">{formatCurrency(value)}</p>
          {trend && (
            <p className="text-sm text-green-600 mt-1">
              <FiTrendingUp size={14} className="inline mr-1" />
              {trend}
            </p>
          )}
        </div>
        <div className={`${color} p-3 rounded-full`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const TransactionRow = ({ transaction }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-white border border-gray-200 rounded-lg gap-2">
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
          transaction.type === 'payment' ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {transaction.type === 'payment' ? (
            <FiDollarSign size={20} className="text-green-600" />
          ) : (
            <FiDownload size={20} className="text-blue-600" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-800">{transaction.description}</p>
          {transaction.client && (
            <p className="text-sm text-gray-600">from {transaction.client}</p>
          )}
          <p className="text-sm text-gray-500">{formatDate(transaction.date)}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${
          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
        </p>
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {transaction.status}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="p-4 sm:p-6 flex items-center justify-center min-h-96">
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin text-[#d97757] mx-auto mb-4" />
          <p className="text-gray-600">Loading earnings data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchEarningsData}
            className="px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Payments & Withdrawals</h2>
        <p className="text-gray-600">Manage your earnings and withdrawal requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <StatCard
          title="Available Balance"
          value={paymentData.availableBalance || 0}
          icon={FiDollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Pending Payments"
          value={paymentData.pendingPayments || 0}
          icon={FiClock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Total Earnings"
          value={paymentData.totalEarnings || 0}
          icon={FiTrendingUp}
          color="bg-blue-500"
          trend={paymentData.monthlyGrowth && typeof paymentData.monthlyGrowth === 'number' ? `${paymentData.monthlyGrowth > 0 ? '+' : ''}${paymentData.monthlyGrowth.toFixed(1)}% from last month` : null}
        />
        <StatCard
          title="This Month"
          value={paymentData.thisMonth || 0}
          icon={FiCalendar}
          color="bg-purple-500"
        />
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Quick Withdrawal</h3>
          <button
            onClick={handleWithdrawalClick}
            className="px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors"
          >
            Request Withdrawal
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            Available Balance: <span className="font-semibold text-green-600">{formatCurrency(paymentData.availableBalance)}</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Note: A 10% processing fee will be deducted from withdrawal amount
          </p>
        </div>
      </div>

      {/* Withdrawal Popup */}
      {showWithdrawalPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Request Withdrawal</h3>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Available Balance:</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(paymentData.availableBalance)}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Amount
              </label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                placeholder="Enter amount"
                max={paymentData.availableBalance}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
              />
              {withdrawalAmount && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    Admin Fee (10%): {formatCurrency(parseFloat(withdrawalAmount) * 0.1)}
                  </p>
                  <p className="text-sm font-medium text-yellow-800">
                    You will receive: {formatCurrency(parseFloat(withdrawalAmount) * 0.9)}
                  </p>
                </div>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
              >
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowWithdrawalPopup(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawal}
                disabled={!withdrawalAmount || parseFloat(withdrawalAmount) > paymentData.availableBalance || submittingWithdrawal}
                className="flex-1 px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-[#c56647] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submittingWithdrawal ? (
                  <FiLoader className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>
            <div className="flex flex-wrap gap-2">
              {['all', 'payments', 'withdrawals'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTransactionFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    transactionFilter === filter
                      ? 'bg-[#d97757] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="text-center py-8">
                <FiDollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions found</p>
                <p className="text-sm text-gray-400 mt-1">
                  {transactionFilter === 'all' 
                    ? 'Your transaction history will appear here'
                    : `No ${transactionFilter} found`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperPayments;
