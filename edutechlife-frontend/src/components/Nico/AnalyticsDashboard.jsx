import React, { useState, useEffect } from 'react';
import analytics from '../../utils/analytics';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');
  const [abTestResults, setAbTestResults] = useState([]);
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([]);

  useEffect(() => {
    loadMetrics();
    const interval = setInterval(loadMetrics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const data = await analytics.getMetrics(timeRange);
      setMetrics(data);
      
      const abResults = await analytics.getABTestResults();
      setAbTestResults(abResults);
      
      const suggestions = await analytics.getOptimizationSuggestions();
      setOptimizationSuggestions(suggestions);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (format) => {
    try {
      await analytics.exportData(format);
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  const runOptimization = async () => {
    try {
      const result = await analytics.runOptimization();
      alert(`Optimization complete: ${result.message}`);
      loadMetrics();
    } catch (error) {
      console.error('Optimization error:', error);
    }
  };

  if (loading && !metrics) {
    return (
      <div className="analytics-dashboard">
        <div className="dashboard-header">
          <h2>Nico Analytics Dashboard</h2>
          <div className="loading">Loading analytics...</div>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toLocaleString();
  };

  const formatPercentage = (num) => {
    if (num === undefined || num === null) return '0%';
    return `${(num * 100).toFixed(1)}%`;
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Nico Analytics Dashboard</h2>
        <div className="dashboard-controls">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="time-selector"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="all">All Time</option>
          </select>
          <button onClick={() => exportData('csv')} className="export-btn">
            Export CSV
          </button>
          <button onClick={() => exportData('json')} className="export-btn">
            Export JSON
          </button>
          <button onClick={runOptimization} className="optimize-btn">
            Run Optimization
          </button>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card primary">
          <h3>Conversations</h3>
          <div className="metric-value">{formatNumber(metrics?.conversations.total)}</div>
          <div className="metric-details">
            <span>Active: {formatNumber(metrics?.conversations.active)}</span>
            <span>Avg Duration: {formatNumber(metrics?.conversations.avgDuration)}s</span>
          </div>
        </div>

        <div className="metric-card success">
          <h3>Leads Captured</h3>
          <div className="metric-value">{formatNumber(metrics?.leads.total)}</div>
          <div className="metric-details">
            <span>Conversion: {formatPercentage(metrics?.leads.conversionRate)}</span>
            <span>Quality: {formatPercentage(metrics?.leads.qualityScore)}</span>
          </div>
        </div>

        <div className="metric-card warning">
          <h3>Appointments</h3>
          <div className="metric-value">{formatNumber(metrics?.appointments.total)}</div>
          <div className="metric-details">
            <span>Scheduled: {formatNumber(metrics?.appointments.scheduled)}</span>
            <span>Completed: {formatNumber(metrics?.appointments.completed)}</span>
          </div>
        </div>

        <div className="metric-card info">
          <h3>Engagement</h3>
          <div className="metric-value">{formatPercentage(metrics?.engagement.rate)}</div>
          <div className="metric-details">
            <span>Messages: {formatNumber(metrics?.engagement.messagesPerSession)}</span>
            <span>Retention: {formatPercentage(metrics?.engagement.retention)}</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <h3>Conversation Trends</h3>
          <div className="chart-placeholder">
            {metrics?.trends.conversations.length > 0 ? (
              <div className="trend-chart">
                {metrics.trends.conversations.map((point, i) => (
                  <div 
                    key={i} 
                    className="trend-bar" 
                    style={{ height: `${Math.min(point.value * 2, 100)}%` }}
                    title={`${point.label}: ${point.value}`}
                  />
                ))}
              </div>
            ) : (
              <div className="no-data">No trend data available</div>
            )}
          </div>
        </div>

        <div className="chart-container">
          <h3>Lead Sources</h3>
          <div className="chart-placeholder">
            {metrics?.sources.length > 0 ? (
              <div className="sources-chart">
                {metrics.sources.map((source, i) => (
                  <div key={i} className="source-item">
                    <span className="source-label">{source.name}</span>
                    <div className="source-bar">
                      <div 
                        className="source-fill" 
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <span className="source-value">{source.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No source data available</div>
            )}
          </div>
        </div>
      </div>

      <div className="optimization-section">
        <h3>A/B Test Results</h3>
        {abTestResults.length > 0 ? (
          <div className="ab-test-results">
            {abTestResults.map((test, i) => (
              <div key={i} className="ab-test-item">
                <div className="test-header">
                  <span className="test-name">{test.name}</span>
                  <span className={`test-status ${test.winner ? 'winner' : 'running'}`}>
                    {test.winner ? `Winner: ${test.winner}` : 'Running'}
                  </span>
                </div>
                <div className="test-variants">
                  {test.variants.map((variant, j) => (
                    <div key={j} className="variant">
                      <span className="variant-name">{variant.name}</span>
                      <span className="variant-conversion">
                        {formatPercentage(variant.conversionRate)}
                      </span>
                      <span className="variant-samples">
                        {variant.samples} samples
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No A/B tests running</div>
        )}

        <h3>Optimization Suggestions</h3>
        {optimizationSuggestions.length > 0 ? (
          <div className="suggestions-list">
            {optimizationSuggestions.map((suggestion, i) => (
              <div key={i} className="suggestion-item">
                <div className="suggestion-header">
                  <span className="suggestion-title">{suggestion.title}</span>
                  <span className={`suggestion-priority ${suggestion.priority}`}>
                    {suggestion.priority}
                  </span>
                </div>
                <p className="suggestion-description">{suggestion.description}</p>
                <div className="suggestion-metrics">
                  <span>Expected Impact: {suggestion.expectedImpact}</span>
                  <span>Confidence: {formatPercentage(suggestion.confidence)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-data">No optimization suggestions available</div>
        )}
      </div>

      <div className="realtime-section">
        <h3>Real-time Activity</h3>
        <div className="activity-feed">
          {metrics?.realtime.activity.length > 0 ? (
            metrics.realtime.activity.map((activity, i) => (
              <div key={i} className="activity-item">
                <span className="activity-time">{activity.time}</span>
                <span className="activity-type">{activity.type}</span>
                <span className="activity-details">{activity.details}</span>
              </div>
            ))
          ) : (
            <div className="no-data">No recent activity</div>
          )}
        </div>
        <div className="realtime-stats">
          <div className="stat-item">
            <span className="stat-label">Active Sessions</span>
            <span className="stat-value">{metrics?.realtime.activeSessions || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Leads Today</span>
            <span className="stat-value">{metrics?.realtime.leadsToday || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Appointments Today</span>
            <span className="stat-value">{metrics?.realtime.appointmentsToday || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;