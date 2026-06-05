import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import JobCard from '../../components/JobCard/JobCard';
import './Dashboard.css';

const INITIAL_FILTERS = {
  locationTypes: [],
  departments: [],
  jobTypes: [],
  experienceMin: 0,
  experienceMax: 12,
  salaryMin: 0,
  skills: [],
};

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [meta, setMeta] = useState({ departments: [], locationTypes: [], jobTypes: [], allSkills: [] });
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch meta filters and initial jobs
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        // Fetch filters metadata
        const metaRes = await fetch('/api/meta/filters');
        if (!metaRes.ok) throw new Error('Failed to fetch filter metadata');
        const metaData = await metaRes.json();
        setMeta(metaData);

        // Fetch all jobs
        const jobsRes = await fetch('/api/jobs');
        if (!jobsRes.ok) throw new Error('Failed to fetch jobs');
        const jobsData = await jobsRes.json();
        setAllJobs(jobsData.jobs || []);

        // Fetch featured list
        const featRes = await fetch('/api/jobs/featured/list');
        if (featRes.ok) {
          const featData = await featRes.json();
          setFeaturedJobs(featData.jobs || []);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter jobs locally whenever filters or searchQuery changes
  useEffect(() => {
    let result = [...allJobs];

    // Search query matching
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.role.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Work Mode (locationTypes)
    if (filters.locationTypes && filters.locationTypes.length > 0) {
      result = result.filter((j) => filters.locationTypes.includes(j.locationType));
    }

    // Department
    if (filters.departments && filters.departments.length > 0) {
      result = result.filter((j) => filters.departments.includes(j.department));
    }

    // Job Type (jobTypes)
    if (filters.jobTypes && filters.jobTypes.length > 0) {
      result = result.filter((j) => filters.jobTypes.includes(j.type));
    }

    // Experience
    if (filters.experienceMin !== undefined) {
      result = result.filter((j) => j.experienceMax >= filters.experienceMin);
    }
    if (filters.experienceMax !== undefined) {
      result = result.filter((j) => j.experienceMin <= filters.experienceMax);
    }

    // Min Salary
    if (filters.salaryMin && filters.salaryMin > 0) {
      result = result.filter((j) => j.salaryMin >= filters.salaryMin);
    }

    // Skills
    if (filters.skills && filters.skills.length > 0) {
      result = result.filter((j) =>
        filters.skills.every((skill) => j.skills.includes(skill))
      );
    }

    setFilteredJobs(result);
  }, [allJobs, searchQuery, filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery('');
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="page-content dashboard-content animate-fade-up">
        {/* Featured Section */}
        {featuredJobs.length > 0 && !searchQuery && (
          <section className="featured-section">
            <h2 className="section-title">
              <span className="section-title__icon">✨</span>
              Featured Opportunities
            </h2>
            <div className="featured-grid">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* Search & Main Layout Grid */}
        <div className="dashboard-grid">
          {/* Sidebar Filters */}
          <aside className="dashboard-grid__filters">
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              meta={meta}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Main Feed */}
          <main className="dashboard-grid__feed">
            <div className="dashboard-search-container">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search jobs, tech stack, key skills, or locations..."
              />
            </div>

            <div className="feed-header">
              <span className="feed-header__count">
                {loading ? 'Finding positions...' : `${filteredJobs.length} positions available`}
              </span>
            </div>

            {loading ? (
              <div className="skeleton-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="skeleton-card skeleton" style={{ height: '220px', borderRadius: '16px' }} />
                ))}
              </div>
            ) : error ? (
              <div className="empty-state">
                <span className="empty-state__icon">⚠️</span>
                <h3 className="empty-state__title">Failed to load jobs</h3>
                <p className="empty-state__desc">{error}</p>
                <button className="btn btn--primary" onClick={() => window.location.reload()}>
                  Retry Connection
                </button>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="empty-state animate-fade-up">
                <span className="empty-state__icon">🔍</span>
                <h3 className="empty-state__title">No positions match your search</h3>
                <p className="empty-state__desc">
                  Try adjusting your filters, clearing your search query, or checking other departments.
                </p>
                <button className="btn btn--ghost" onClick={handleResetFilters}>
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="jobs-grid">
                {filteredJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
