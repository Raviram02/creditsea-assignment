import { useState } from 'react';
import { Upload, FileText, User, CreditCard, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const CreditReportApp = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.xml')) {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid XML file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('xmlFile', file);

      const response = await fetch('https://creditsea-assignment-backend-01ui.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setReportData(data.data);
        setActiveTab('report');
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Failed to connect to server. Please ensure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr.length !== 8) return 'N/A';
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CreditSea</h1>
          <p className="text-gray-600">Credit Report Analysis System</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="inline-block w-4 h-4 mr-2" />
              Upload
            </button>
            <button
              onClick={() => setActiveTab('report')}
              disabled={!reportData}
              className={`px-6 py-2 rounded-md transition-all ${
                activeTab === 'report'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <FileText className="inline-block w-4 h-4 mr-2" />
              Report
            </button>
          </div>
        </div>

        {/* Upload Section */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Upload Credit Report</h2>
                <p className="text-gray-600">Select an XML file containing Experian credit report data</p>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  accept=".xml"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <FileText className="w-12 h-12 text-gray-400 mb-3" />
                    <span className="text-gray-600 mb-2">
                      {file ? file.name : 'Click to select XML file'}
                    </span>
                    <span className="text-sm text-gray-500">or drag and drop</span>
                  </div>
                </label>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-red-700">{error}</span>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Processing...' : 'Upload and Process'}
              </button>
            </div>
          </div>
        )}

        {/* Report Section */}
        {activeTab === 'report' && reportData && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Basic Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <User className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Basic Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Full Name</p>
                  <p className="font-semibold text-gray-800">{reportData.basicDetails.name}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Mobile Phone</p>
                  <p className="font-semibold text-gray-800">{reportData.basicDetails.mobilePhone}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">PAN</p>
                  <p className="font-semibold text-gray-800">{reportData.basicDetails.pan}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Credit Score</p>
                  <p className="text-3xl font-bold text-green-600">{reportData.basicDetails.creditScore}</p>
                </div>
              </div>
            </div>

            {/* Report Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Report Summary</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-3xl font-bold text-blue-600">{reportData.reportSummary.totalAccounts}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Accounts</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{reportData.reportSummary.activeAccounts}</p>
                  <p className="text-sm text-gray-600 mt-1">Active Accounts</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-3xl font-bold text-gray-600">{reportData.reportSummary.closedAccounts}</p>
                  <p className="text-sm text-gray-600 mt-1">Closed Accounts</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-3xl font-bold text-yellow-600">{reportData.reportSummary.last7DaysEnquiries}</p>
                  <p className="text-sm text-gray-600 mt-1">Last 7 Days Enquiries</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(reportData.reportSummary.currentBalance)}</p>
                </div>
                <div className="p-4 border border-green-200 rounded-lg bg-green-50">
                  <p className="text-sm text-gray-600 mb-1">Secured Accounts</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(reportData.reportSummary.securedAmount)}</p>
                </div>
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <p className="text-sm text-gray-600 mb-1">Unsecured Accounts</p>
                  <p className="text-xl font-bold text-orange-600">{formatCurrency(reportData.reportSummary.unsecuredAmount)}</p>
                </div>
              </div>
            </div>

            {/* Credit Accounts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Credit Accounts Information</h2>
              </div>
              <div className="space-y-4">
                {reportData.creditAccounts.map((account, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{account.bank}</h3>
                        <p className="text-sm text-gray-500">Account: {account.accountNumber}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {account.accountStatus === 'Active' ? (
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center">
                            <XCircle className="w-4 h-4 mr-1" />
                            Closed
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Account Type</p>
                        <p className="font-semibold text-gray-800">{account.accountType}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Current Balance</p>
                        <p className="font-semibold text-gray-800">{formatCurrency(account.currentBalance)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Amount Overdue</p>
                        <p className={`font-semibold ${account.amountOverdue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {formatCurrency(account.amountOverdue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Open Date</p>
                        <p className="font-semibold text-gray-800">{formatDate(account.openDate)}</p>
                      </div>
                    </div>
                    {account.address && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="text-sm text-gray-800">{account.address}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditReportApp;
