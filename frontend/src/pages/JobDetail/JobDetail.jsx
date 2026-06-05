import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import JobCard from '../../components/JobCard/JobCard';
import './JobDetail.css';

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: '',
    coverLetter: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch current job
        const res = await fetch(`/api/jobs/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error('Job posting not found');
          throw new Error('Failed to fetch job details');
        }
        const jobData = await res.json();
        setJob(jobData);

        // Sync save and apply status
        const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setIsSaved(saved.some((item) => item.id === jobData.id));

        const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        setHasApplied(applied.includes(jobData.id));

        // Fetch similar jobs (same department)
        const allRes = await fetch('/api/jobs');
        if (allRes.ok) {
          const allData = await allRes.json();
          const filtered = (allData.jobs || [])
            .filter((j) => j.department === jobData.department && j.id !== jobData.id)
            .slice(0, 3);
          setSimilarJobs(filtered);
        }

        // Prepopulate form if profile exists
        const prof = JSON.parse(localStorage.getItem('userProfile') || 'null');
        if (prof) {
          setFormData({
            name: prof.name || '',
            email: prof.email || '',
            resume: prof.resume || '',
            coverLetter: '',
          });
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleToggleSave = () => {
    let saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const index = saved.findIndex((item) => item.id === job.id);

    if (index > -1) {
      saved.splice(index, 1);
      setIsSaved(false);
    } else {
      saved.push(job);
      setIsSaved(true);
    }

    localStorage.setItem('savedJobs', JSON.stringify(saved));
    window.dispatchEvent(new CustomEvent('savedJobsUpdated'));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleApplySubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.resume) {
      alert('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      let applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (!applied.includes(job.id)) {
        applied.push(job.id);
        localStorage.setItem('appliedJobs', JSON.stringify(applied));
      }

      // Sync apply details to profile so they persist next time
      const existingProf = JSON.parse(localStorage.getItem('userProfile') || 'null');
      const newProf = {
        name: formData.name,
        email: formData.email,
        resume: formData.resume,
        title: existingProf?.title || '',
        phone: existingProf?.phone || '',
        bio: existingProf?.bio || '',
        skills: existingProf?.skills || '',
        photo: existingProf?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80',
      };
      localStorage.setItem('userProfile', JSON.stringify(newProf));
      window.dispatchEvent(new CustomEvent('profileUpdated'));

      setHasApplied(true);
      setSubmitting(false);
      setFormSubmitted(true);

      // Increment applicants count locally for UX
      setJob(prev => prev ? { ...prev, applicants: prev.applicants + 1 } : null);
    }, 1200);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="job-detail-page">
        <Navbar />
        <div className="page-content loading-center">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="job-detail-page">
        <Navbar />
        <div className="page-content">
          <div className="empty-state">
            <span className="empty-state__icon">⚠️</span>
            <h3 className="empty-state__title">Failed to load details</h3>
            <p className="empty-state__desc">{error || 'Could not find details for this role.'}</p>
            <Link to="/dashboard" className="btn btn--primary">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="job-detail-page">
      <Navbar />

      <div className="page-content job-detail-content animate-fade-up">
        {/* Back Link */}
        <div className="job-detail-back">
          <Link to="/dashboard" className="btn-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Explore
          </Link>
        </div>

        {/* Hero Header */}
        <section className="job-detail-hero">
          <div className="job-detail-hero__logo">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.company} onError={(e) => { e.target.style.display = 'none'; }} />
            ) : null}
            <div className="job-detail-hero__logo-placeholder">
              {job.company.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="job-detail-hero__info">
            <div className="job-detail-hero__meta">
              <span className="job-detail-hero__company">{job.company}</span>
              {job.featured && <span className="badge badge--featured">Featured</span>}
            </div>
            <h1 className="job-detail-hero__title">{job.role}</h1>
            <p className="job-detail-hero__location">📍 {job.location}</p>
          </div>

          <div className="job-detail-hero__actions">
            <button 
              className={`btn btn--ghost job-detail-hero__save ${isSaved ? 'job-detail-hero__save--active' : ''}`}
              onClick={handleToggleSave}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              {isSaved ? 'Saved' : 'Save position'}
            </button>

            {hasApplied ? (
              <button className="btn btn--primary job-detail-hero__apply" disabled>
                ✓ Applied
              </button>
            ) : (
              <button className="btn btn--primary job-detail-hero__apply" onClick={() => setShowApplyModal(true)}>
                Apply Now
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            )}
          </div>
        </section>

        {/* Main Details Grid */}
        <div className="job-detail-grid">
          {/* Left Column: Descriptions */}
          <main className="job-detail-main">
            <div className="job-detail-card">
              <h2 className="job-detail-card__section-title">About the Role</h2>
              <p className="job-detail-card__text">{job.description}</p>
            </div>

            <div className="job-detail-card">
              <h2 className="job-detail-card__section-title">Key Responsibilities</h2>
              <ul className="job-detail-card__list">
                {job.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className="job-detail-card">
              <h2 className="job-detail-card__section-title">Requirements & Skills</h2>
              <ul className="job-detail-card__list">
                {job.requirements.map((req, i) => (
                  <li key={i}>{req}</li>
                ))}
              </ul>
            </div>

            {job.benefits && job.benefits.length > 0 && (
              <div className="job-detail-card">
                <h2 className="job-detail-card__section-title">Compensation & Benefits</h2>
                <div className="job-detail-benefits">
                  {job.benefits.map((benefit, i) => (
                    <div key={i} className="job-detail-benefit-chip">
                      <span className="job-detail-benefit-icon">🎁</span>
                      <span className="job-detail-benefit-label">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Right Column: Metadata details card */}
          <aside className="job-detail-sidebar">
            <div className="job-metadata-card">
              <h3 className="job-metadata-card__title">Position Details</h3>
              
              <div className="job-metadata-items">
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Compensation (USD)</span>
                  <span className="job-metadata-item__value highlight">{job.salary}</span>
                </div>
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Experience Required</span>
                  <span className="job-metadata-item__value">{job.experience}</span>
                </div>
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Department</span>
                  <span className="job-metadata-item__value">{job.department}</span>
                </div>
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Job Type</span>
                  <span className="job-metadata-item__value">{job.type}</span>
                </div>
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Workplace Style</span>
                  <span className="job-metadata-item__value">{job.locationType}</span>
                </div>
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Date Posted</span>
                  <span className="job-metadata-item__value">{formatDate(job.postedAt)}</span>
                </div>
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Application Deadline</span>
                  <span className="job-metadata-item__value">{formatDate(job.deadline)}</span>
                </div>
                <div className="job-metadata-item">
                  <span className="job-metadata-item__label">Active Applicants</span>
                  <span className="job-metadata-item__value font-numeric">{job.applicants} applied</span>
                </div>
              </div>

              <div className="divider" style={{ margin: '16px 0' }} />

              <div className="job-metadata-skills">
                <span className="job-metadata-skills__title">Skills Needed</span>
                <div className="job-metadata-skills__list">
                  {job.skills.map((skill) => (
                    <span key={skill} className="job-metadata-skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Similar Jobs Feed */}
        {similarJobs.length > 0 && (
          <section className="similar-jobs-section">
            <h2 className="section-title">
              <span className="section-title__icon">🔗</span>
              Similar Roles in {job.department}
            </h2>
            <div className="jobs-grid">
              {similarJobs.map((simJob) => (
                <JobCard key={simJob.id} job={simJob} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-backdrop">
          <div className="apply-modal animate-fade-up">
            <div className="apply-modal__header">
              <div>
                <h2 className="apply-modal__title">Application</h2>
                <p className="apply-modal__subtitle">Applying to {job.company} for {job.role}</p>
              </div>
              <button className="apply-modal__close" onClick={() => { setShowApplyModal(false); setFormSubmitted(false); }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {formSubmitted ? (
              <div className="apply-success-state">
                <div className="apply-success-state__icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="apply-success-state__title">Application Submitted!</h3>
                <p className="apply-success-state__desc">
                  Your details have been successfully transmitted to the {job.company} acquisition team. You can track your notifications for future reviews.
                </p>
                <button className="btn btn--primary" onClick={() => { setShowApplyModal(false); setFormSubmitted(false); }}>
                  Return to Details
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="apply-modal__form">
                <div className="form-group">
                  <label className="form-label" htmlFor="name">Full Name <span className="required">*</span></label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address <span className="required">*</span></label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="form-input"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="resume">Resume PDF Link <span className="required">*</span></label>
                  <input
                    id="resume"
                    name="resume"
                    type="url"
                    required
                    className="form-input"
                    placeholder="https://drive.google.com/..."
                    value={formData.resume}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="coverLetter">Cover Letter (Optional)</label>
                  <textarea
                    id="coverLetter"
                    name="coverLetter"
                    className="form-input form-textarea"
                    placeholder="State why you are a great match for this position..."
                    rows={4}
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    disabled={submitting}
                  />
                </div>

                <div className="apply-modal__footer">
                  <button 
                    type="button" 
                    className="btn btn--ghost" 
                    onClick={() => setShowApplyModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn--primary btn-submit-application"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner" style={{ width: '14px', height: '14px', borderThickness: '1px' }} />
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetail;
