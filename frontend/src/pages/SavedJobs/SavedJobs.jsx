import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar/SearchBar';
import JobCard from '../../components/JobCard/JobCard';
import './SavedJobs.css';

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = () => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedJobs(saved);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();

    const handleSavedUpdated = () => {
      loadJobs();
    };

    window.addEventListener('savedJobsUpdated', handleSavedUpdated);
    return () => {
      window.removeEventListener('savedJobsUpdated', handleSavedUpdated);
    };
  }, []);

  // Filter jobs when searchQuery or savedJobs changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredJobs(savedJobs);
    } else {
      const q = searchQuery.toLowerCase();
      const filtered = savedJobs.filter(
        (j) =>
          j.role.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, savedJobs]);

  const handleRemoveSave = (jobId) => {
    // This is called by JobCard when saving toggles.
    // The state listens to 'savedJobsUpdated' which will trigger reload,
    // but we can also immediately filter locally for visual speed.
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  return (
    <div className="saved-jobs-page">
      <Navbar />

      <div className="page-content saved-jobs-content animate-fade-up">
        {savedJobs.length > 0 && (
          <div className="saved-jobs-search-row">
            <div className="saved-jobs-search">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search within saved roles..."
              />
            </div>
            <div className="saved-jobs-count-summary">
              <span>{filteredJobs.length} of {savedJobs.length} tracked roles</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loading-center">
            <div className="spinner" />
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="empty-state animate-fade-up">
            <span className="empty-state__icon">🔖</span>
            <h3 className="empty-state__title">No saved opportunities</h3>
            <p className="empty-state__desc">
              Bookmark positions on the dashboard to track your application process and save listings for review.
            </p>
            <Link to="/dashboard" className="btn btn--primary">
              Browse Available Roles
            </Link>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="empty-state animate-fade-up">
            <span className="empty-state__icon">🔍</span>
            <h3 className="empty-state__title">No matches in your bookmarks</h3>
            <p className="empty-state__desc">
              We couldn't find any saved jobs matching "{searchQuery}". Try updating your query terms.
            </p>
            <button className="btn btn--ghost" onClick={() => setSearchQuery('')}>
              Clear Search
            </button>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                onToggleSave={handleRemoveSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedJobs;
