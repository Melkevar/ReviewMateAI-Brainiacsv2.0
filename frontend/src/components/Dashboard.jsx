import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileText, Eye, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const response = await axios.get('/contracts');
      setContracts(response.data);
    } catch (error) {
      setError('Failed to fetch contracts');
      console.error('Error fetching contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContract = async (contractId) => {
    if (!window.confirm('Are you sure you want to delete this contract?')) {
      return;
    }

    try {
      await axios.delete(`/contracts/${contractId}`);
      setContracts(contracts.filter(contract => contract.contractId !== contractId));
    } catch (error) {
      setError('Failed to delete contract');
      console.error('Error deleting contract:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <FileText size={48} />
          <p>Loading your contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
        <p className="dashboard-subtitle">
          Manage your contracts and get AI-powered insights to ensure compliance and reduce risks.
        </p>
      </div>

      <div className="dashboard-actions">
        <Link to="/upload" className="btn-secondary">
          <Upload size={20} />
          Upload New Contract
        </Link>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {contracts.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} />
          <h3>No contracts yet</h3>
          <p>Upload your first contract to get started with AI-powered review and analysis.</p>
          <Link to="/upload" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Upload Contract
          </Link>
        </div>
      ) : (
        <div className="contracts-grid">
          {contracts.map((contract) => (
            <div key={contract.contractId} className="contract-card">
              <div className="contract-name">{contract.fileName}</div>
              <div className="contract-date">
                <Calendar size={14} />
                Uploaded {formatDate(contract.uploadedAt)}
              </div>
              <div className={`contract-status ${contract.status === 'Analyzed' ? 'status-analyzed' : 'status-pending'}`}>
                {contract.status}
              </div>
              <div className="contract-actions">
                <Link 
                  to={`/contract/${contract.contractId}/review`}
                  className="btn-small btn-view"
                >
                  <Eye size={16} />
                  {contract.status === 'Analyzed' ? 'View Review' : 'Generate Review'}
                </Link>
                <button 
                  onClick={() => handleDeleteContract(contract.contractId)}
                  className="btn-small btn-delete"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;