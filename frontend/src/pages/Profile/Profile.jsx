import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import './Profile.css';

// SVG developer avatar vector arts
const PRESET_AVATARS = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="url(%23g1)"/><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%237c6af7"/><stop offset="100%" stop-color="%23b88fff"/></linearGradient></defs><circle cx="50" cy="42" r="16" fill="white" fill-opacity="0.85"/><path d="M25 80c0-12 10-20 25-20s25 8 25 20z" fill="white" fill-opacity="0.85"/><circle cx="42" cy="40" r="2" fill="%23111118"/><circle cx="58" cy="40" r="2" fill="%23111118"/><path d="M46 72h8v4h-8z" fill="%23b88fff"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="url(%23g2)"/><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230ea5e9"/><stop offset="100%" stop-color="%2322c55e"/></linearGradient></defs><circle cx="50" cy="42" r="16" fill="white" fill-opacity="0.85"/><path d="M25 80c0-12 10-20 25-20s25 8 25 20z" fill="white" fill-opacity="0.85"/><circle cx="42" cy="40" r="2" fill="%23111118"/><circle cx="58" cy="40" r="2" fill="%23111118"/><path d="M38 32c5-3 19-3 24 0" stroke="%23111118" stroke-width="2" fill="none"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="url(%23g3)"/><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%23f43f5e"/></linearGradient></defs><circle cx="50" cy="42" r="16" fill="white" fill-opacity="0.85"/><path d="M25 80c0-12 10-20 25-20s25 8 25 20z" fill="white" fill-opacity="0.85"/><circle cx="42" cy="40" r="2" fill="%23111118"/><circle cx="58" cy="40" r="2" fill="%23111118"/><path d="M44 48q6 4 12 0" stroke="%23111118" stroke-width="2" fill="none"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="url(%23g4)"/><defs><linearGradient id="g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f97316"/><stop offset="100%" stop-color="%23eab308"/></linearGradient></defs><circle cx="50" cy="42" r="16" fill="white" fill-opacity="0.85"/><path d="M25 80c0-12 10-20 25-20s25 8 25 20z" fill="white" fill-opacity="0.85"/><circle cx="42" cy="42" r="1.5" fill="%23111118"/><circle cx="58" cy="42" r="1.5" fill="%23111118"/><rect x="40" y="32" width="20" height="3" rx="1.5" fill="%23111118"/></svg>',
];

function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    bio: '',
    resume: '',
    resumeName: '',
    skills: '',
    photo: '',
  });

  const [savedCount, setSavedCount] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    // Load profile
    const prof = JSON.parse(localStorage.getItem('userProfile') || 'null');
    if (prof) {
      setFormData({
        name: prof.name || '',
        title: prof.title || '',
        email: prof.email || '',
        phone: prof.phone || '',
        bio: prof.bio || '',
        resume: prof.resume || '',
        resumeName: prof.resumeName || '',
        skills: prof.skills || '',
        photo: prof.photo || PRESET_AVATARS[0],
      });
    } else {
      // Set default avatar
      setFormData((prev) => ({ ...prev, photo: PRESET_AVATARS[0] }));
    }

    // Load counts
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedCount(saved.length);

    const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    setAppliedCount(applied.length);
  }, []);

  // Compute profile completion percentage
  useEffect(() => {
    const fields = ['name', 'title', 'email', 'phone', 'bio', 'resume', 'skills'];
    const filledCount = fields.filter((f) => !!formData[f]?.trim()).length;
    const percentage = Math.round((filledCount / fields.length) * 100);
    setProfileCompletion(percentage);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectAvatar = (url) => {
    setFormData({ ...formData, photo: url });
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 1.5MB for localStorage storage safety
    if (file.size > 1.5 * 1024 * 1024) {
      alert('Avatar image size must be less than 1.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, photo: event.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Limit to 2.5MB for localStorage storage safety
    if (file.size > 2.5 * 1024 * 1024) {
      alert('Resume file size must be less than 2.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({
        ...prev,
        resume: event.target.result,
        resumeName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    setFormData((prev) => ({
      ...prev,
      resume: '',
      resumeName: '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    localStorage.setItem('userProfile', JSON.stringify(formData));
    window.dispatchEvent(new CustomEvent('profileUpdated'));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="profile-page">
      <Navbar />

      <div className="page-content profile-content animate-fade-up">
        {/* Toast Notification */}
        {showToast && (
          <div className="toast-notification animate-fade-up">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Profile settings saved successfully!</span>
          </div>
        )}

        <div className="profile-grid">
          {/* Left Column: Summary Card */}
          <aside className="profile-sidebar">
            <div className="profile-card profile-card--summary">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-large">
                  {formData.photo ? (
                    <img src={formData.photo} alt="Avatar Preview" />
                  ) : (
                    <span>{formData.name ? formData.name.charAt(0).toUpperCase() : '?'}</span>
                  )}
                </div>
              </div>

              <div className="profile-summary-info">
                <h2 className="profile-summary-name">{formData.name || 'Your Name'}</h2>
                <p className="profile-summary-title">{formData.title || 'Add professional title'}</p>
              </div>

              {/* Progress Indicator */}
              <div className="profile-progress">
                <div className="profile-progress__header">
                  <span>Profile Strength</span>
                  <span className="profile-progress__value">{profileCompletion}%</span>
                </div>
                <div className="profile-progress__track">
                  <div 
                    className="profile-progress__fill" 
                    style={{ width: `${profileCompletion}%` }} 
                  />
                </div>
              </div>

              <div className="divider" style={{ margin: '20px 0' }} />

              {/* Stats Counters */}
              <div className="profile-counters">
                <div className="profile-counter">
                  <span className="profile-counter__value">{appliedCount}</span>
                  <span className="profile-counter__label">Applications</span>
                </div>
                <div className="profile-counter__divider" />
                <div className="profile-counter__value-wrapper">
                  <div className="profile-counter">
                    <span className="profile-counter__value">{savedCount}</span>
                    <span className="profile-counter__label">Saved Jobs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Resume Fast access card */}
            <div className="profile-card profile-card--sub">
              <h3 className="profile-subcard__title">Resume Link</h3>
              {formData.resume ? (
                <div className="profile-resume-info-block">
                  <a 
                    href={formData.resume} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="profile-resume-link"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                    <span>{formData.resumeName || 'View Attached Resume'}</span>
                  </a>
                </div>
              ) : (
                <span className="profile-resume-empty">No resume uploaded yet.</span>
              )}
            </div>
          </aside>

          {/* Right Column: Settings Form */}
          <main className="profile-form-container">
            <div className="profile-card">
              <h2 className="profile-section-title">Personal Settings</h2>

              <form onSubmit={handleSubmit} className="profile-form">
                {/* Avatar Picker */}
                <div className="form-group">
                  <label className="form-label">Profile Avatar</label>
                  <div className="avatar-settings-layout">
                    <div className="avatar-picker-row">
                      {PRESET_AVATARS.map((url, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`avatar-picker-btn ${formData.photo === url ? 'active' : ''}`}
                          onClick={() => handleSelectAvatar(url)}
                        >
                          <img src={url} alt={`Avatar Preset ${idx + 1}`} />
                        </button>
                      ))}
                    </div>
                    
                    <div className="avatar-upload-field">
                      <label className="btn btn--ghost avatar-upload-btn" htmlFor="avatar-file-input">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Upload custom image
                      </label>
                      <input
                        id="avatar-file-input"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarUpload}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">Full Name</label>
                    <input
                      id="profile-name"
                      name="name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sarah Connor"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-title">Professional Title</label>
                    <input
                      id="profile-title"
                      name="title"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Senior Frontend Engineer"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-email">Email Address</label>
                    <input
                      id="profile-email"
                      name="email"
                      type="email"
                      className="form-input"
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                    <input
                      id="profile-phone"
                      name="phone"
                      type="tel"
                      className="form-input"
                      placeholder="e.g. +1 (555) 019-2834"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* File Upload Resume */}
                <div className="form-group">
                  <label className="form-label">Resume PDF Document</label>
                  {formData.resume ? (
                    <div className="resume-uploaded-block">
                      <div className="resume-uploaded-details">
                        <span className="resume-file-icon">📄</span>
                        <span className="resume-file-name">{formData.resumeName || 'resume.pdf'}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-remove-resume"
                        onClick={handleRemoveResume}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="resume-upload-zone">
                      <label className="resume-upload-label" htmlFor="resume-file-input">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px', color: 'var(--text-muted)' }}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <span>Click to upload PDF resume file</span>
                        <span className="resume-upload-subtext">Supports PDF format (Max 2.5MB)</span>
                      </label>
                      <input
                        id="resume-file-input"
                        type="file"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleResumeUpload}
                      />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-skills">Professional Skills (comma separated)</label>
                  <input
                    id="profile-skills"
                    name="skills"
                    type="text"
                    className="form-input"
                    placeholder="React, TypeScript, CSS, Node.js, GraphQL"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                  {formData.skills.trim() && (
                    <div className="profile-skills-preview">
                      {formData.skills.split(',').map((skill, index) => {
                        const trimmed = skill.trim();
                        return trimmed ? (
                          <span key={index} className="profile-skill-chip">
                            {trimmed}
                          </span>
                        ) : null;
                      })}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-bio">Short Biography</label>
                  <textarea
                    id="profile-bio"
                    name="bio"
                    className="form-input form-textarea"
                    placeholder="Describe your background, achievements, and career path..."
                    rows={5}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>

                <div className="profile-form-footer">
                  <button type="submit" className="btn btn--primary">
                    Save Profile Settings
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Profile;
