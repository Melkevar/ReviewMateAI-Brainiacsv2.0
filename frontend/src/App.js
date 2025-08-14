import React, { useState, useEffect } from 'react';
import { Upload, FileText, AlertTriangle, CheckCircle, Trash2, LogOut, User, Eye, Download, Moon, Sun, ChevronDown, ChevronUp, Info } from 'lucide-react';
import './ReviewMateApp.css';

const ReviewMateApp = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('login');
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState({});

  // Authentication Forms State
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '' });

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  // Mock API calls
  const mockAPI = {
    register: async (userData) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      return { message: "User registered successfully", userId: "64afae6b9c45e" };
    },
    
    login: async (credentials) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      if (credentials.email && credentials.password) {
        return {
          token: "jwt_token_here",
          user: { id: "64afae6b9c45e", name: "John Doe", email: credentials.email }
        };
      }
      throw new Error("Invalid email or password");
    },
    
    uploadContract: async (file) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
      const newContract = {
        contractId: `c${Date.now()}`,
        fileName: file.name,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Analyzed',
        riskScore: Math.floor(Math.random() * 40) + 60,
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
      };
      setContracts(prev => [...prev, newContract]);
      return { message: "Contract uploaded successfully", contractId: newContract.contractId };
    },
    
    getContracts: async () => {
      return contracts;
    },
    
    getReview: async (contractId) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      return {
        contractId,
        riskScore: 85,
        summary: "This contract has several areas that require attention, particularly around termination clauses and payment terms. The intellectual property section could also be strengthened.",
        issues: [
          {
            id: 1,
            clause: "Termination Clause",
            risk: "Unclear notice period requirements",
            recommendation: "Specify notice period of at least 30 days for better clarity. Consider adding provisions for immediate termination in cases of material breach.",
            riskLevel: "High",
            explanation: "The current language leaves room for interpretation which could lead to disputes. Clear notice periods protect both parties."
          },
          {
            id: 2,
            clause: "Payment Terms",
            risk: "Late payment penalties not defined",
            recommendation: "Include specific penalties for late payments (e.g., 1.5% monthly interest) to protect interests. Add provisions for suspension of services for non-payment.",
            riskLevel: "Medium",
            explanation: "Without defined penalties, you have limited recourse for late payments which could impact cash flow."
          },
          {
            id: 3,
            clause: "Intellectual Property",
            risk: "IP ownership could be clearer",
            recommendation: "Explicitly state IP ownership and usage rights. Consider adding clauses for pre-existing IP and derivative works.",
            riskLevel: "Medium",
            explanation: "Ambiguous IP terms can lead to disputes over ownership of work products and innovations."
          },
          {
            id: 4,
            clause: "Force Majeure",
            risk: "Limited scope of covered events",
            recommendation: "Expand force majeure clause to include modern risks like cyber attacks, pandemics, and supply chain disruptions.",
            riskLevel: "Low",
            explanation: "The current clause may not adequately protect against unforeseen modern business disruptions."
          }
        ]
      };
    },
    
    deleteContract: async (contractId) => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setContracts(prev => prev.filter(c => c.contractId !== contractId));
      setLoading(false);
      return { message: "Contract deleted successfully" };
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await mockAPI.login(loginForm);
      setUser(response.user);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
      showNotification('Login successful!');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await mockAPI.register(registerForm);
      showNotification('Registration successful! Please login.');
      setCurrentView('login');
      setRegisterForm({ name: '', email: '', password: '' });
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) {
      handleFileUpload({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0] || e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      showNotification('Please upload PDF or DOCX files only', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      showNotification('File size should be less than 10MB', 'error');
      return;
    }

    try {
      await mockAPI.uploadContract(file);
      showNotification('Contract uploaded successfully!');
      if (e.target) e.target.value = '';
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleViewReview = async (contract) => {
    try {
      const review = await mockAPI.getReview(contract.contractId);
      setSelectedContract({ ...contract, review });
      setCurrentView('review');
      // Initialize expanded state for all issues as false
      const initialExpandedState = {};
      review.issues.forEach(issue => {
        initialExpandedState[issue.id] = false;
      });
      setExpandedIssues(initialExpandedState);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const toggleIssueExpansion = (issueId) => {
    setExpandedIssues(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  const handleDeleteContract = async (contractId) => {
    if (window.confirm('Are you sure you want to delete this contract?')) {
      try {
        await mockAPI.deleteContract(contractId);
        showNotification('Contract deleted successfully!');
      } catch (error) {
        showNotification(error.message, 'error');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentView('login');
    setContracts([]);
    setSelectedContract(null);
    showNotification('Logged out successfully!');
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'high-risk';
      case 'medium': return 'medium-risk';
      case 'low': return 'low-risk';
      default: return '';
    }
  };

  const getRiskScoreColor = (score) => {
    if (score >= 80) return 'high-risk';
    if (score >= 60) return 'medium-risk';
    return 'low-risk';
  };

  const AuthForm = ({ type }) => (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-title">
          <h1 className="auth-heading">Review Mate AI</h1>
          <p className="auth-subheading">Smart Contract Analysis Platform</p>
        </div>

        <form onSubmit={type === 'login' ? handleLogin : handleRegister} className="space-y-6">
          {type === 'register' && (
            <div className="auth-form-group">
              <label className="auth-label">Full Name</label>
              <input
                type="text"
                required
                className="auth-input"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                placeholder="Enter your full name"
              />
            </div>
          )}
          
          <div className="auth-form-group">
            <label className="auth-label">Email Address</label>
            <input
              type="email"
              required
              className="auth-input"
              value={type === 'login' ? loginForm.email : registerForm.email}
              onChange={(e) => type === 'login' 
                ? setLoginForm({...loginForm, email: e.target.value})
                : setRegisterForm({...registerForm, email: e.target.value})}
              placeholder="Enter your email"
            />
          </div>
          
          <div className="auth-form-group">
            <label className="auth-label">Password</label>
            <input
              type="password"
              required
              className="auth-input"
              value={type === 'login' ? loginForm.password : registerForm.password}
              onChange={(e) => type === 'login' 
                ? setLoginForm({...loginForm, password: e.target.value})
                : setRegisterForm({...registerForm, password: e.target.value})}
              placeholder="Enter your password"
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="loading-spinner inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Processing...
              </span>
            ) : (
              type === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentView(type === 'login' ? 'register' : 'login')}
            className="auth-link"
          >
            {type === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );

  const Dashboard = () => (
    <div className="app-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Review Mate AI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 px-3 py-2 rounded-md"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Upload Section */}
        <div className="upload-section">
          <h2 className="text-xl font-semibold mb-4">Upload Contract for Review</h2>
          <div 
            className={`upload-area ${dragOver ? 'drag-over' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-4">Drag & drop your contract here or</p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              disabled={loading}
            />
            <label
              htmlFor="file-upload"
              className={`upload-button ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Uploading...' : 'Browse Files'}
            </label>
            <p className="text-xs text-gray-500 mt-3">Supports PDF and DOCX files up to 10MB</p>
          </div>
        </div>

        {/* Contracts List */}
        <div className="contracts-list">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Contracts</h2>
              <div className="text-sm text-gray-500">
                {contracts.length} {contracts.length === 1 ? 'contract' : 'contracts'}
              </div>
            </div>
          </div>
          <div className="p-6">
            {contracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contracts uploaded yet</p>
                <p className="text-sm text-gray-400 mt-2">Upload your first contract to get started</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {contracts.map((contract) => (
                  <div key={contract.contractId} className="contract-item">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <FileText className="h-8 w-8 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="font-medium truncate">{contract.fileName}</h3>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <span>{contract.uploadDate}</span>
                            <span>•</span>
                            <span>{contract.fileSize}</span>
                          </div>
                        </div>
                        <span className={`contract-status ${contract.status === 'Analyzed' ? 'status-analyzed' : 'status-pending'}`}>
                          {contract.status}
                        </span>
                        {contract.riskScore && (
                          <span className={`risk-score ${getRiskScoreColor(contract.riskScore)}`}>
                            Risk Score: {contract.riskScore}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewReview(contract)}
                          disabled={loading}
                          className="action-button view-button tooltip"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                          <span className="tooltip-text">View detailed analysis</span>
                        </button>
                        <button
                          onClick={() => handleDeleteContract(contract.contractId)}
                          disabled={loading}
                          className="action-button delete-button tooltip"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                          <span className="tooltip-text">Delete this contract</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );

  const ReviewView = () => (
    <div className="app-container">
      {/* Header */}
      <header className="review-header">
        <div className="dashboard-container">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="back-button flex items-center"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold truncate max-w-xs md:max-w-md">
                {selectedContract?.fileName}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button className="action-button view-button">
                <Download className="h-4 w-4 mr-1" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Review Content */}
      <main className="dashboard-main">
        {loading ? (
          <div className="space-y-6">
            <div className="risk-overview">
              <div className="skeleton h-6 w-1/3 mb-4"></div>
              <div className="flex items-center space-x-6">
                <div className="skeleton h-12 w-12 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-3/4"></div>
                </div>
              </div>
            </div>
            <div className="contracts-list">
              <div className="skeleton h-6 w-1/4 mb-4 mx-6"></div>
              <div className="space-y-4 p-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="skeleton h-24 w-full rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Risk Score Overview */}
            <div className="risk-overview">
              <h2 className="text-xl font-semibold mb-4">Risk Assessment Overview</h2>
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getRiskScoreColor(selectedContract?.review?.riskScore)}`}>
                    {selectedContract?.review?.riskScore}
                  </div>
                  <div className="text-sm text-gray-500">Risk Score</div>
                </div>
                <div className="flex-1">
                  <div className="risk-meter">
                    <div 
                      className="risk-meter-indicator" 
                      style={{ 
                        left: `${selectedContract?.review?.riskScore}%`,
                        borderColor: `var(--${getRiskScoreColor(selectedContract?.review?.riskScore)})`
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedContract?.review?.riskScore >= 80 ? 'High risk contract - review carefully' :
                     selectedContract?.review?.riskScore >= 60 ? 'Medium risk - some issues to address' :
                     'Low risk - generally acceptable terms'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Summary */}
            {selectedContract?.review?.summary && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  AI Analysis Summary
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  {selectedContract?.review?.summary}
                </p>
              </div>
            )}

            {/* Issues and Recommendations */}
            <div className="contracts-list">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Issues & Recommendations</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {selectedContract?.review?.issues?.map((issue) => (
                    <div 
                      key={issue.id}
                      className={`issue-card ${getRiskColor(issue.riskLevel)} ${expandedIssues[issue.id] ? 'active' : ''}`}
                      onClick={() => toggleIssueExpansion(issue.id)}
                    >
                      <div className="issue-card-header flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 mt-1 ${getRiskColor(issue.riskLevel)}`}>
                            {issue.riskLevel === 'High' ? <AlertTriangle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-semibold">{issue.clause}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(issue.riskLevel)}`}>
                                {issue.riskLevel} Risk
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{issue.risk}</p>
                          </div>
                        </div>
                        <button 
                          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleIssueExpansion(issue.id);
                          }}
                        >
                          {expandedIssues[issue.id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </button>
                      </div>
                      <div className="issue-card-content">
                        <div className="recommendation-box">
                          <p className="recommendation-text">
                            <strong>Recommendation:</strong> {issue.recommendation}
                          </p>
                        </div>
                        {issue.explanation && (
                          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                            <p><strong>Why this matters:</strong> {issue.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );

  return (
    <div className="App">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type === 'error' ? 'notification-error' : 'notification-success'}`}>
          {notification.type === 'error' ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <CheckCircle className="h-5 w-5" />
          )}
          {notification.message}
        </div>
      )}

      {/* Main App Content */}
      {!isAuthenticated ? (
        currentView === 'login' ? <AuthForm type="login" /> : <AuthForm type="register" />
      ) : (
        currentView === 'dashboard' ? <Dashboard /> : <ReviewView />
      )}
    </div>
  );
};

export default ReviewMateApp;