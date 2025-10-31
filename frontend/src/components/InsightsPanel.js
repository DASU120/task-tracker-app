// frontend/src/components/InsightsPanel.js
import React, { useState, useEffect } from 'react';
import './InsightsPanel.css';

const InsightsPanel = () => {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await fetch('http://localhost:3000/insights');
        const data = await res.json();
        setSummary(data.summary);
      } catch (err) {
        console.error('Failed to fetch insights', err);
      }
    };

    fetchInsights();
  }, []);

  return (
    <div className="insights-panel">
      <h2>Smart Insights</h2>
      <p dangerouslySetInnerHTML={{ __html: summary.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
    </div>
  );
};

export default InsightsPanel;