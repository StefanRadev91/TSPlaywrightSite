import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiCheckCircle, FiCircle, FiPlay, FiCode, FiLayers } from 'react-icons/fi';
import './ProgressBar.css';

const courses = [
  { id: 'typescript', label: 'TypeScript', path: '/typescript', icon: FiCode, color: 'blue' },
  { id: 'playwright', label: 'Playwright', path: '/playwright', icon: FiPlay, color: 'green' },
  { id: 'pom', label: 'Page Object Model', path: '/pom', icon: FiLayers, color: 'purple' },
];

function ProgressBar() {
  const { progress, currentUser } = useAuth();

  if (!currentUser) return null;

  const completedCount = Object.values(progress).filter(Boolean).length;
  const percentage = Math.round((completedCount / courses.length) * 100);

  return (
    <div className="progress-section">
      <div className="progress-header">
        <h3 className="progress-title">Your Learning Progress</h3>
        <span className="progress-percent">{percentage}% Complete</span>
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="progress-courses">
        {courses.map(({ id, label, path, icon: Icon, color }) => (
          <Link
            key={id}
            to={path}
            className={`progress-course progress-course--${color} ${progress[id] ? 'progress-course--done' : ''}`}
          >
            <div className="progress-course__icon">
              <Icon size={20} />
            </div>
            <div className="progress-course__info">
              <span className="progress-course__name">{label}</span>
              <span className="progress-course__status">
                {progress[id] ? (
                  <><FiCheckCircle size={14} /> Completed</>
                ) : (
                  <><FiCircle size={14} /> Not started</>
                )}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;
