import React, { useState, useRef } from 'react';
import './SearchBar.css';

function SearchBar({ value, onChange, onSearch, placeholder = 'Search roles, companies, skills...' }) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch && onSearch(value);
    }
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  };

  return (
    <div className={`searchbar${focused ? ' searchbar--focused' : ''}`}>
      <span className="searchbar__icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
      </span>
      <input
        ref={inputRef}
        type="text"
        className="searchbar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          className="searchbar__clear"
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          tabIndex={-1}
          aria-label="Clear search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
      <kbd className="searchbar__hint">↵</kbd>
    </div>
  );
}

export default SearchBar;