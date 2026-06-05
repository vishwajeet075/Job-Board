import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './JobCard.css';

function JobCard({ job, onToggleSave }) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setIsSaved(saved.some((item) => item.id === job.id));

    const handleSavedUpdated = () => {
      const s = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setIsSaved(s.some((item) => item.id === job.id));
    };

    window.addEventListener('savedJobsUpdated', handleSavedUpdated);
    return () => {
      window.removeEventListener('savedJobsUpdated', handleSavedUpdated);
    };
  }, [job.id]);

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const index = saved.findIndex((item) => item.id === job.id);

    if (index > -1) {
      saved.splice(index, 1);
    } else {
      saved.push(job);
    }

    localStorage.setItem('savedJobs', JSON.stringify(saved));
    window.dispatchEvent(new CustomEvent('savedJobsUpdated'));
    
    if (onToggleSave) {
      onToggleSave(job.id);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Future';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getWorkModeBadgeClass = (mode) => {
    const m = mode.toLowerCase();
    if (m === 'remote') return 'badge--remote';
    if (m === 'hybrid') return 'badge--hybrid';
    return 'badge--onsite';
  };

  return (
    <div className={`job-card ${job.featured ? 'job-card--featured animate-fade-up' : 'animate-fade-up'}`}>
      <div className="job-card__header">
        <div className="job-card__header-left">
          <div className="job-card__company-logo">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} onError={(e) => { e.target.style.display = 'none'; }} />
            ) : null}
            <div className="job-card__company-logo-placeholder">
              {job.company.charAt(0).toUpperCase()}
            </div>
          </div>
          {job.featured && (
            <span className="badge badge--featured">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Featured
            </span>
          )}
        </div>

        <button 
          className={`job-card__bookmark-btn ${isSaved ? 'job-card__bookmark-btn--active' : ''}`}
          onClick={handleSaveClick}
          aria-label={isSaved ? "Unsave job" : "Save job"}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
        </button>
      </div>

      <Link to={`/jobs/${job.id}`} className="job-card__body">
        <span className="job-card__company-name">{job.company}</span>
        <h3 className="job-card__role">{job.role}</h3>
        <p className="job-card__location">{job.location}</p>
        
        <div className="job-card__details">
          <span className={`badge ${getWorkModeBadgeClass(job.locationType)}`}>
            {job.locationType === 'Remote' && '🌐 '}
            {job.locationType === 'Hybrid' && '🏙 '}
            {job.locationType === 'Onsite' && '🏢 '}
            {job.locationType}
          </span>
          <span className="badge badge--type">{job.type}</span>
          <span className="job-card__salary">{job.salary}</span>
        </div>

        <div className="job-card__divider" />

        <div className="job-card__footer">
          <div className="job-card__skills">
            {job.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="job-card__skill-tag">
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="job-card__skill-tag job-card__skill-tag--more">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>
          <span className="job-card__posted-time">{formatDate(job.postedAt)}</span>
        </div>
      </Link>
    </div>
  );
}

export default JobCard;
