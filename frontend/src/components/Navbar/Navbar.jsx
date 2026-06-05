import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const prof = JSON.parse(localStorage.getItem('userProfile') || 'null');
    setProfile(prof);

    const handleStorage = () => {
      const p = JSON.parse(localStorage.getItem('userProfile') || 'null');
      setProfile(p);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('profileUpdated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('profileUpdated', handleStorage);
    };
  }, []);

  // Determine page title or time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: profile?.name ? `${getGreeting()}, ${profile.name.split(' ')[0]}!` : `${getGreeting()}!`,
          subtitle: 'Find your next career move today.',
        };
      case '/saved':
        return {
          title: 'Saved Positions',
          subtitle: 'Your curated list of tracked opportunities.',
        };
      case '/profile':
        return {
          title: 'Professional Profile',
          subtitle: 'Manage your portfolio and resume settings.',
        };
      default:
        if (location.pathname.startsWith('/jobs/')) {
          return {
            title: 'Role Specification',
            subtitle: 'Review position details and apply.',
          };
        }
        return {
          title: 'TalentDeck',
          subtitle: 'Navigate your tech career.',
        };
    }
  };

  const pageInfo = getPageInfo();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const simulatedNotifications = [
    { id: 1, text: 'Linear viewed your profile details', time: '2h ago', read: false },
    { id: 2, text: 'New Senior React job matched your skills', time: '1d ago', read: true },
    { id: 3, text: 'Application to Stripe received', time: '3d ago', read: true },
  ];

  return (
    <header className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <h1 className="navbar__title">{pageInfo.title}</h1>
          <p className="navbar__subtitle">{pageInfo.subtitle}</p>
        </div>

        <div className="navbar__right">
          {/* Date Display */}
          <div className="navbar__date">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>{currentDate}</span>
          </div>

          {/* Notifications */}
          <div className="navbar__notification-wrapper">
            <button 
              className={`btn--icon navbar__notification-btn ${showNotifications ? 'active' : ''}`}
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label="View notifications"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="navbar__notification-badge" />
            </button>

            {showNotifications && (
              <div className="navbar__dropdown animate-fade-up">
                <div className="navbar__dropdown-header">
                  <h3>Notifications</h3>
                  <button className="navbar__dropdown-clear" onClick={() => setShowNotifications(false)}>Close</button>
                </div>
                <ul className="navbar__notification-list">
                  {simulatedNotifications.map((notif) => (
                    <li key={notif.id} className={`navbar__notification-item ${!notif.read ? 'unread' : ''}`}>
                      <div className="navbar__notif-bullet" />
                      <div className="navbar__notif-content">
                        <p className="navbar__notif-text">{notif.text}</p>
                        <span className="navbar__notif-time">{notif.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick User Avatar */}
          <Link to="/profile" className="navbar__avatar-link">
            <div className="navbar__avatar">
              {profile?.photo ? (
                <img src={profile.photo} alt={profile.name} />
              ) : (
                <span>{profile?.name ? profile.name.charAt(0).toUpperCase() : '?'}</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
