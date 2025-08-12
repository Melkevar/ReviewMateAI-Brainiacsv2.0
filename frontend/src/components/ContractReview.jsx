import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';

const ContractReview = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchReview();
  }, [id]);

  const fetchReview = async () => {
    try {
      const response = await axios.get(`/contracts/${id}/review`);
      setReview(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        // Review doesn't exist, we'll show option to generate it
        setReview(null);
      } else {
        setError('Failed to fetch review');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateReview = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await axios.post(`/contracts/${id}/review`);
      setReview(response.data);
    } catch (error) {
      setError('Failed to generate review');
    } finally {
      setGenerating(false);
    }
  };

  const getRiskIcon = (riskScore) => {
    if (riskScore >= 80) return <AlertTriangle size={20} />;
    if (riskScore >= 50) return <AlertCircle size={20} />;
    return <CheckCircle size={20} />;
  };

  const getRiskClass = (riskScore) => {
    if (riskScore >= 80) return 'risk-high';
    if (riskScore >= 50) return 'risk-medium';
    return 'risk-low';
  };

  const getRiskLabel = (riskScore) => {
    if (riskScore >= 80) return 'High Risk';
    if (riskScore >= 50) return 'Medium Risk';
    return 'Low Risk';
  };

  if (loading) {
    return (
      <div className="review-container">
        <div className="loading">
          <FileText size={48} />
          <p>Loading contract review...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="review-container">
        <div className="error-message">
          {error}
        </div>
        <Link to="/dashboard" className="btn-secondary">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="review-container">
        <div className="review-header">
          <Link to="/dashboard" className="btn-secondary" style={{ marginBottom: '1rem' }}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="review-title">Contract Review</h1>
        </div>

        <div className="empty-state">
          <FileText size={64} />
          <h3>Review Not Generated</h3>
          <p>This contract hasn't been analyzed yet. Click the button below to generate an AI-powered review.</p>
          <button 
            onClick={generateReview}
            className="btn-primary"
            disabled={generating}
            style={{ marginTop: '1rem' }}
          >
            {generating ? 'Generating Review...' : 'Generate AI Review'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="review-container">
      <div className="review-header">
        <Link to="/dashboard" className="btn-secondary" style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="review-title">Contract Review</h1>
        <div className={`risk-score ${getRiskClass(review.riskScore)}`}>
          {getRiskIcon(review.riskScore)}
          Risk Score: {review.riskScore}/100 - {getRiskLabel(review.riskScore)}
        </div>
      </div>

      <div className="issues-list">
        {review.issues && review.issues.length > 0 ? (
          review.issues.map((issue, index) => (
            <div key={index} className="issue-card">
              <div className="issue-clause">{issue.clause}</div>
              <div className="issue-risk">{issue.risk}</div>
              <div className="issue-recommendation">{issue.recommendation}</div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <CheckCircle size={64} />
            <h3>No Issues Found</h3>
            <p>This contract appears to be well-structured with no major risks identified.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractReview;