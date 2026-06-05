import React, { useState, useEffect } from 'react';
import './FilterPanel.css';

const EXPERIENCE_MARKS = [0, 2, 4, 6, 8, 10, 12];

function FilterPanel({ filters, onChange, meta, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const update = (key, value) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onChange(updated);
  };

  const toggleArrayFilter = (key, value) => {
    const current = localFilters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    update(key, updated);
  };

  const activeCount = Object.values(localFilters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== '' && v !== null && v !== undefined
  ).length;

  return (
    <div className="filter-panel">
      <div className="filter-panel__header">
        <span className="filter-panel__title">
          Filters
          {activeCount > 0 && (
            <span className="filter-panel__active-count">{activeCount}</span>
          )}
        </span>
        {activeCount > 0 && (
          <button className="filter-panel__reset" onClick={onReset}>
            Reset all
          </button>
        )}
      </div>

      {/* Work Mode */}
      <FilterSection title="Work Mode">
        <div className="filter-chips">
          {(meta?.locationTypes || ['Remote', 'Hybrid', 'Onsite']).map((lt) => (
            <button
              key={lt}
              className={`filter-chip${(localFilters.locationTypes || []).includes(lt) ? ' filter-chip--active' : ''}`}
              onClick={() => toggleArrayFilter('locationTypes', lt)}
            >
              {lt === 'Remote' && '🌐 '}
              {lt === 'Hybrid' && '🏙 '}
              {lt === 'Onsite' && '🏢 '}
              {lt}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Department */}
      <FilterSection title="Department">
        <div className="filter-chips">
          {(meta?.departments || []).map((dept) => (
            <button
              key={dept}
              className={`filter-chip${(localFilters.departments || []).includes(dept) ? ' filter-chip--active' : ''}`}
              onClick={() => toggleArrayFilter('departments', dept)}
            >
              {dept}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Job Type */}
      <FilterSection title="Job Type">
        <div className="filter-chips">
          {(meta?.jobTypes || ['Full-time', 'Part-time', 'Contract']).map((jt) => (
            <button
              key={jt}
              className={`filter-chip${(localFilters.jobTypes || []).includes(jt) ? ' filter-chip--active' : ''}`}
              onClick={() => toggleArrayFilter('jobTypes', jt)}
            >
              {jt}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Experience */}
      <FilterSection title="Experience (years)">
        <div className="filter-range">
          <div className="filter-range__values">
            <span className="filter-range__val">
              {localFilters.experienceMin || 0}y
            </span>
            <span className="filter-range__sep">—</span>
            <span className="filter-range__val">
              {localFilters.experienceMax || 12}y+
            </span>
          </div>
          <div className="filter-range__sliders">
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={localFilters.experienceMin || 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val <= (localFilters.experienceMax || 12)) {
                  update('experienceMin', val);
                }
              }}
              className="filter-range__input filter-range__input--min"
            />
            <input
              type="range"
              min={0}
              max={12}
              step={1}
              value={localFilters.experienceMax || 12}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= (localFilters.experienceMin || 0)) {
                  update('experienceMax', val);
                }
              }}
              className="filter-range__input filter-range__input--max"
            />
          </div>
          <div className="filter-range__marks">
            {EXPERIENCE_MARKS.map((m) => (
              <span key={m} className="filter-range__mark">{m}</span>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* Salary */}
      <FilterSection title="Min Salary (USD)">
        <div className="filter-salary-options">
          {[0, 100000, 130000, 150000, 170000].map((val) => (
            <button
              key={val}
              className={`filter-chip${localFilters.salaryMin === val ? ' filter-chip--active' : ''}`}
              onClick={() => update('salaryMin', localFilters.salaryMin === val ? 0 : val)}
            >
              {val === 0 ? 'Any' : `$${(val / 1000).toFixed(0)}k+`}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Skills */}
      {meta?.allSkills?.length > 0 && (
        <FilterSection title="Skills">
          <div className="filter-skills">
            {meta.allSkills.slice(0, 20).map((skill) => (
              <button
                key={skill}
                className={`filter-skill-tag${(localFilters.skills || []).includes(skill) ? ' filter-skill-tag--active' : ''}`}
                onClick={() => toggleArrayFilter('skills', skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="filter-section">
      <button className="filter-section__header" onClick={() => setOpen(!open)}>
        <span className="filter-section__title">{title}</span>
        <svg
          className={`filter-section__chevron${open ? '' : ' filter-section__chevron--closed'}`}
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="filter-section__body">{children}</div>}
    </div>
  );
}

export default FilterPanel;