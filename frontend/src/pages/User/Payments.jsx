import React, { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { userAPI } from '../../services/api';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] = useState({
    totalSpent: 0,
    thisMonth: 0,
    pending: 0
  });

  // Mock payment methods for now (since there's no backend endpoint for this yet)
  const paymentMethods = [
    {
      id: 1,
      type: 'credit',
      brand: 'Visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'credit',
      brand: 'Mastercard',
      last4: '8888',
      expiry: '09/26',
      isDefault: false
    },
    {
      id: 3,
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false
    }
  ];

  useEffect(() => {
    fetchPayments();
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await userAPI.getBalance();
      setBalance(response.data.balance);
    } catch (err) {
      console.error('Error fetching balance:', err);
    }
  };

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (parseFloat(topUpAmount) > 10000) {
      setError('Maximum top-up amount is $10,000');
      return;
    }

    try {
      setTopUpLoading(true);
      setError(null);
      
      const response = await userAPI.topUpBalance(parseFloat(topUpAmount));
      
      setBalance(response.data.newBalance);
      setShowTopUpModal(false);
      setTopUpAmount('');
      
      // Refresh payments to show the top-up transaction
      fetchPayments();
      
      // Show success message
      alert(`Successfully topped up $${topUpAmount}. New balance: $${response.data.newBalance}`);
    } catch (err) {
      console.error('Error topping up balance:', err);
      setError(err.response?.data?.message || 'Failed to top up balance');
    } finally {
      setTopUpLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getMyPayments();
      const paymentsData = response.data.payments || [];
      
      setPayments(paymentsData);
      calculatePaymentSummary(paymentsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payment data');
    } finally {
      setLoading(false);
    }
  };

  const calculatePaymentSummary = (paymentsData) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let totalSpent = 0;
    let thisMonth = 0;
    let pending = 0;
    
    paymentsData.forEach(payment => {
      // Skip balance top-ups from spent calculation
      if (payment.paymentMethod === 'balance_topup') {
        return;
      }
      
      const amount = parseFloat(payment.amount);
      totalSpent += amount;
      
      if (payment.status === 'pending') {
        pending += amount;
      }
      
      const paymentDate = new Date(payment.createdAt);
      if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
        thisMonth += amount;
      }
    });
    
    setPaymentSummary({
      totalSpent,
      thisMonth,
      pending
    });
  };

  const formatPaymentForDisplay = (payment) => {
    const isTopUp = payment.paymentMethod === 'balance_topup';
    
    return {
      id: payment.id,
      type: isTopUp ? 'topup' : 'payment',
      description: payment.description || (isTopUp ? 'Balance Top-up' : `Payment for ${payment.project?.title || 'Project'}`),
      amount: isTopUp ? parseFloat(payment.amount) : -parseFloat(payment.amount), // Positive for top-ups, negative for payments
      date: new Date(payment.createdAt).toLocaleDateString(),
      status: payment.status,
      method: payment.paymentMethod || 'Not specified',
      payee: isTopUp ? 'Account Credit' : (payment.payee?.name || 'Unknown')
    };
  };

  // Get formatted transactions for display
  const transactions = payments.map(formatPaymentForDisplay);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'payment': return '↗'; // Outgoing payment
      case 'topup': return '↙'; // Incoming top-up
      default: return '↔'; // Other transactions
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
          <p className="text-gray-600 mt-2">Manage your payment methods and view transaction history.</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d97757]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
        <p className="text-gray-600 mt-2">Manage your payment methods and view transaction history.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Balance Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <BanknotesIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Balance</p>
                <p className="text-2xl font-bold text-gray-900">${balance.toLocaleString()}</p>
              </div>
            </div>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="bg-[#d97757] text-white p-2 rounded-lg hover:bg-orange-600 transition-colors"
              title="Top Up Balance"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <BanknotesIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">${paymentSummary.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">${paymentSummary.thisMonth.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <ClockIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">${paymentSummary.pending.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-[#d97757] text-[#d97757]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Transaction History
            </button>
            <button
              onClick={() => setActiveTab('methods')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'methods'
                  ? 'border-[#d97757] text-[#d97757]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment Methods
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'transactions' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>

              <div className="overflow-x-auto">
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <BanknotesIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No transactions</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't made any payments yet.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Transaction</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Method</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                transaction.type === 'payment' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                              }`}>
                                {getTransactionIcon(transaction.type)}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                                {transaction.payee && (
                                  <p className="text-xs text-gray-500">to {transaction.payee}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-600">{transaction.date}</td>
                          <td className="py-4 px-4 text-sm text-gray-600">{transaction.method}</td>
                          <td className="py-4 px-4">
                            <span className={`text-sm font-medium ${
                              transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                            }`}>
                              ${Math.abs(transaction.amount).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.status)}`}>
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <button className="text-gray-400 hover:text-[#d97757] transition-colors">
                              <EyeIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'methods' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
                <button className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-orange-600 transition-colors">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Payment Method
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <CreditCardIcon className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-3">
                          {method.type === 'credit' ? (
                            <>
                              <p className="font-medium text-gray-900">{method.brand} •••• {method.last4}</p>
                              <p className="text-sm text-gray-600">Expires {method.expiry}</p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-gray-900">PayPal</p>
                              <p className="text-sm text-gray-600">{method.email}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {method.isDefault && (
                      <div className="flex items-center justify-between">
                        <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Default
                        </span>
                      </div>
                    )}
                    
                    {!method.isDefault && (
                      <button className="text-sm text-[#d97757] hover:text-orange-600 transition-colors">
                        Set as Default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Up Balance</h3>
              <button
                onClick={() => {
                  setShowTopUpModal(false);
                  setTopUpAmount('');
                  setError(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Balance: <span className="font-semibold">${balance.toLocaleString()}</span></p>
            </div>

            <div className="mb-4">
              <label htmlFor="topUpAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Top Up
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  id="topUpAmount"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  max="10000"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d97757] focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Minimum: $1, Maximum: $10,000</p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowTopUpModal(false);
                  setTopUpAmount('');
                  setError(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={topUpLoading || !topUpAmount || parseFloat(topUpAmount) <= 0}
                className="flex-1 px-4 py-2 bg-[#d97757] text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {topUpLoading ? 'Processing...' : 'Top Up'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
