import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiCalendar, FiCheckCircle, FiCircle, FiPlay, FiCode, FiLayers, FiRefreshCw, FiXCircle, FiAward } from 'react-icons/fi';
import './Profile.css';

const courses = [
  { id: 'typescript', label: 'TypeScript Fundamentals', path: '/typescript', icon: FiCode, color: 'blue', desc: 'Types, interfaces, classes, generics, and async patterns.' },
  { id: 'playwright', label: 'Playwright Essentials', path: '/playwright', icon: FiPlay, color: 'green', desc: 'Browser automation, locators, assertions, and reporting.' },
  { id: 'pom', label: 'Page Object Model', path: '/pom', icon: FiLayers, color: 'purple', desc: 'Enterprise design pattern for maintainable tests.' },
];

function Profile() {
  const { currentUser, progress, quizHistory, resetProgress } = useAuth();
  const [resetting, setResetting] = useState(false);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const percentage = Math.round((completedCount / courses.length) * 100);

  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const joinDate = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
    : 'N/A';

  // All-time quiz stats
  const allTimeStats = useMemo(() => {
    const all = quizHistory || [];
    const correct = all.filter(q => q.correct).length;
    const total = all.length;
    const rate = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, rate };
  }, [quizHistory]);

  // Quiz stats for last 30 days
  const quizStats = useMemo(() => {
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const recent = (quizHistory || []).filter(q => q.timestamp >= thirtyDaysAgo);
    const correct = recent.filter(q => q.correct).length;
    const wrong = recent.length - correct;
    const rate = recent.length > 0 ? Math.round((correct / recent.length) * 100) : 0;

    // Group by date for the chart
    const byDate = {};
    recent.forEach(q => {
      if (!byDate[q.date]) byDate[q.date] = { correct: 0, wrong: 0 };
      if (q.correct) byDate[q.date].correct++;
      else byDate[q.date].wrong++;
    });

    // Get last 30 days labels
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      days.push({
        key,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        correct: byDate[key]?.correct || 0,
        wrong: byDate[key]?.wrong || 0
      });
    }

    return { correct, wrong, total: recent.length, rate, days };
  }, [quizHistory]);

  async function handleReset() {
    if (!window.confirm('Are you sure you want to reset all your progress? This cannot be undone.')) return;
    setResetting(true);
    await resetProgress();
    setResetting(false);
  }

  return (
    <div className="profile-page">
      <div className="container">
        {/* User Info Card */}
        <div className="profile-card">
          <div className="profile-card__avatar">{initial}</div>
          <div className="profile-card__info">
            <h1 className="profile-card__name">{displayName}</h1>
            <div className="profile-card__meta">
              <span><FiMail size={14} /> {currentUser?.email}</span>
              <span><FiCalendar size={14} /> Joined {joinDate}</span>
            </div>
          </div>
        </div>

        {/* All-Time Quiz Stats */}
        <div className="alltime-stats">
          <h2><FiAward size={20} /> Quiz Overview</h2>
          <div className="alltime-stats__grid">
            <div className="alltime-stats__item">
              <span className="alltime-stats__num">{allTimeStats.total}</span>
              <span className="alltime-stats__label">Total Attempts</span>
            </div>
            <div className="alltime-stats__item alltime-stats__item--correct">
              <span className="alltime-stats__num">{allTimeStats.correct}</span>
              <span className="alltime-stats__label">Correct Answers</span>
            </div>
            <div className="alltime-stats__item alltime-stats__item--rate">
              <span className="alltime-stats__num">{allTimeStats.rate}%</span>
              <span className="alltime-stats__label">Success Rate</span>
            </div>
          </div>
          {allTimeStats.total > 0 && (
            <div className="alltime-stats__bar-track">
              <div className="alltime-stats__bar-fill" style={{ width: `${allTimeStats.rate}%` }} />
            </div>
          )}
        </div>

        {/* Quiz Stats */}
        <div className="quiz-stats">
          <div className="quiz-stats__header">
            <h2><FiAward size={20} /> Quiz Performance</h2>
            <span className="quiz-stats__period">Last 30 days</span>
          </div>

          <div className="quiz-stats__cards">
            <div className="quiz-stats__card quiz-stats__card--total">
              <span className="quiz-stats__card-num">{quizStats.total}</span>
              <span className="quiz-stats__card-label">Questions Answered</span>
            </div>
            <div className="quiz-stats__card quiz-stats__card--correct">
              <span className="quiz-stats__card-num">{quizStats.correct}</span>
              <span className="quiz-stats__card-label">Correct</span>
            </div>
            <div className="quiz-stats__card quiz-stats__card--wrong">
              <span className="quiz-stats__card-num">{quizStats.wrong}</span>
              <span className="quiz-stats__card-label">Wrong</span>
            </div>
            <div className="quiz-stats__card quiz-stats__card--rate">
              <span className="quiz-stats__card-num">{quizStats.rate}%</span>
              <span className="quiz-stats__card-label">Success Rate</span>
            </div>
          </div>

          {/* Activity chart */}
          {quizStats.total > 0 && (
            <div className="quiz-stats__chart">
              <div className="quiz-stats__chart-label">Daily Activity</div>
              <div className="quiz-stats__chart-grid">
                {quizStats.days.map(day => (
                  <div key={day.key} className="quiz-stats__day" title={`${day.label}: ${day.correct} correct, ${day.wrong} wrong`}>
                    <div className="quiz-stats__day-bar">
                      {day.correct > 0 && (
                        <div className="quiz-stats__day-correct" style={{ height: `${day.correct * 20}px` }} />
                      )}
                      {day.wrong > 0 && (
                        <div className="quiz-stats__day-wrong" style={{ height: `${day.wrong * 20}px` }} />
                      )}
                      {day.correct === 0 && day.wrong === 0 && (
                        <div className="quiz-stats__day-empty" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="quiz-stats__chart-legend">
                <span><span className="quiz-stats__legend-dot quiz-stats__legend-dot--correct" /> Correct</span>
                <span><span className="quiz-stats__legend-dot quiz-stats__legend-dot--wrong" /> Wrong</span>
              </div>
            </div>
          )}

          {quizStats.total === 0 && (
            <div className="quiz-stats__empty">
              <p>No quiz answers yet. Visit the <Link to="/">Home page</Link> to try the Question of the Day!</p>
            </div>
          )}

          {/* Recent answers */}
          {quizStats.total > 0 && (
            <div className="quiz-stats__recent">
              <h3>Recent Answers</h3>
              <div className="quiz-stats__recent-list">
                {[...(quizHistory || [])].reverse().slice(0, 10).map((q, i) => (
                  <div key={i} className={`quiz-stats__recent-item ${q.correct ? 'quiz-stats__recent-item--correct' : 'quiz-stats__recent-item--wrong'}`}>
                    {q.correct ? <FiCheckCircle size={16} /> : <FiXCircle size={16} />}
                    <span className="quiz-stats__recent-date">{q.date}</span>
                    <span className="quiz-stats__recent-result">{q.correct ? 'Correct' : 'Wrong'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress Overview */}
        <div className="profile-progress">
          <div className="profile-progress__header">
            <h2>Learning Progress</h2>
            <span className="profile-progress__badge">
              {completedCount}/{courses.length} Completed ({percentage}%)
            </span>
          </div>

          <div className="profile-progress__bar-track">
            <div className="profile-progress__bar-fill" style={{ width: `${percentage}%` }} />
          </div>

          <div className="profile-courses">
            {courses.map(({ id, label, path, icon: Icon, color, desc }) => (
              <div key={id} className={`profile-course profile-course--${color} ${progress[id] ? 'profile-course--done' : ''}`}>
                <div className="profile-course__left">
                  <div className={`profile-course__icon profile-course__icon--${color}`}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="profile-course__name">{label}</h3>
                    <p className="profile-course__desc">{desc}</p>
                  </div>
                </div>
                <div className="profile-course__right">
                  {progress[id] ? (
                    <span className="profile-course__status profile-course__status--done">
                      <FiCheckCircle size={18} /> Completed
                    </span>
                  ) : (
                    <Link to={path} className="profile-course__status profile-course__status--go">
                      <FiCircle size={18} /> Start Learning
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              className="profile-reset"
              onClick={handleReset}
              disabled={resetting}
            >
              <FiRefreshCw size={16} className={resetting ? 'spinning' : ''} />
              {resetting ? 'Resetting...' : 'Reset All Progress'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
