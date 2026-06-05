import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const NAV_ITEMS = [
  {
    path: '/dashboard',
    label: 'Explore',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: '/saved',
    label: 'Saved Jobs',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function Sidebar() {
  const location = useLocation();
  const [savedCount, setSavedCount] = useState(0);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    setSavedCount(saved.length);

    const prof = JSON.parse(localStorage.getItem('userProfile') || 'null');
    setProfile(prof);

    const handleStorage = () => {
      const s = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setSavedCount(s.length);
      const p = JSON.parse(localStorage.getItem('userProfile') || 'null');
      setProfile(p);
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('savedJobsUpdated', handleStorage);
    window.addEventListener('profileUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('savedJobsUpdated', handleStorage);
      window.removeEventListener('profileUpdated', handleStorage);
    };
  }, []);

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-mark">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--accent)" />
            <path d="M2 17l10 5 10-5" stroke="var(--accent-bright)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M2 12l10 5 10-5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" fill="none" />
          </svg>
        </div>
        <span className="sidebar__logo-text">TalentDeck</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav">
        <span className="sidebar__nav-label">Menu</span>
        <ul className="sidebar__nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__nav-item${isActive ? ' sidebar__nav-item--active' : ''}`
                }
              >
                <span className="sidebar__nav-icon">{item.icon}</span>
                <span className="sidebar__nav-text">{item.label}</span>
                {item.path === '/saved' && savedCount > 0 && (
                  <span className="sidebar__badge">{savedCount}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Spacer */}
      <div className="sidebar__spacer" />

      {/* Quick Stats */}
      <div className="sidebar__stats">
        <div className="sidebar__stat">
          <span className="sidebar__stat-value">12</span>
          <span className="sidebar__stat-label">Open Roles</span>
        </div>
        <div className="sidebar__stat-divider" />
        <div className="sidebar__stat">
          <span className="sidebar__stat-value">{savedCount}</span>
          <span className="sidebar__stat-label">Saved</span>
        </div>
      </div>

      {/* Profile Footer */}
      <NavLink
        to="/profile"
        className={`sidebar__profile-footer${location.pathname === '/profile' ? ' sidebar__profile-footer--active' : ''}`}
      >
        <div className="sidebar__avatar">
          {profile?.photo ? (
            <img src={profile.photo} alt={profile.name} />
          ) : (
            <span>{profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}</span>
          )}
        </div>
        <div className="sidebar__profile-info">
          <span className="sidebar__profile-name">
            {profile?.name || 'Complete Profile'}
          </span>
          <span className="sidebar__profile-role">
            {profile?.title || 'Add your title'}
          </span>
        </div>
        <svg className="sidebar__profile-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </NavLink>
    </aside>
  );
}

export default Sidebar;