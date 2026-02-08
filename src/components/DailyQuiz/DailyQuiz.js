import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import quizQuestions from '../../data/quizQuestions';
import { FiCheckCircle, FiXCircle, FiArrowRight, FiAward, FiClock } from 'react-icons/fi';
import './DailyQuiz.css';

function getDailyQuestion() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return quizQuestions[dayOfYear % quizQuestions.length];
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function DailyQuiz() {
  const { currentUser, saveQuizAnswer, quizHistory } = useAuth();
  const question = useMemo(() => getDailyQuestion(), []);

  // Check if already answered today (logged-in: from quizHistory, guest: from localStorage)
  const previousAnswer = useMemo(() => {
    const todayKey = getTodayKey();

    if (currentUser && quizHistory) {
      const todayEntry = quizHistory.find(q => q.date === todayKey);
      if (todayEntry) {
        return { selected: todayEntry.correct ? question.correct : -1, correct: todayEntry.correct };
      }
    }

    try {
      const stored = localStorage.getItem('dailyQuizAnswer');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.date === todayKey) {
          return { selected: parsed.selected, correct: parsed.selected === question.correct };
        }
      }
    } catch {}

    return null;
  }, [currentUser, quizHistory, question]);

  const [selected, setSelected] = useState(previousAnswer?.selected ?? null);
  const [answered, setAnswered] = useState(!!previousAnswer);

  const isCorrect = selected === question.correct;

  function handleAnswer(index) {
    if (answered) return;
    setSelected(index);
    setAnswered(true);

    // Save to localStorage for guests
    try {
      localStorage.setItem('dailyQuizAnswer', JSON.stringify({
        date: getTodayKey(),
        questionId: question.id,
        selected: index
      }));
    } catch {}

    if (currentUser && saveQuizAnswer) {
      saveQuizAnswer(question.id, index === question.correct);
    }
  }

  return (
    <div className="daily-quiz">
      <div className="daily-quiz__header">
        <div className="daily-quiz__badge">
          <FiAward size={14} />
          Question of the Day
        </div>
        <span className="daily-quiz__category">{question.category}</span>
      </div>

      <h3 className="daily-quiz__question">{question.question}</h3>

      <div className="daily-quiz__options">
        {question.options.map((option, index) => {
          let className = 'daily-quiz__option';
          if (answered) {
            if (index === question.correct) {
              className += ' daily-quiz__option--correct';
            } else if (index === selected && !isCorrect) {
              className += ' daily-quiz__option--wrong';
            } else {
              className += ' daily-quiz__option--dimmed';
            }
          } else if (index === selected) {
            className += ' daily-quiz__option--selected';
          }

          return (
            <button
              key={index}
              className={className}
              onClick={() => handleAnswer(index)}
              disabled={answered}
            >
              <span className="daily-quiz__option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="daily-quiz__option-text">{option}</span>
              {answered && index === question.correct && (
                <FiCheckCircle className="daily-quiz__option-icon" size={18} />
              )}
              {answered && index === selected && !isCorrect && index !== question.correct && (
                <FiXCircle className="daily-quiz__option-icon" size={18} />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className={`daily-quiz__result ${isCorrect ? 'daily-quiz__result--correct' : 'daily-quiz__result--wrong'}`}>
          <div className="daily-quiz__result-header">
            {isCorrect ? (
              <><FiCheckCircle size={20} /> Correct!</>
            ) : (
              <><FiXCircle size={20} /> Not quite!</>
            )}
          </div>
          <p className="daily-quiz__explanation">{question.explanation}</p>

          {previousAnswer && (
            <div className="daily-quiz__comeback">
              <FiClock size={14} /> You already answered today. Come back tomorrow for a new question!
            </div>
          )}

          {!currentUser && (
            <div className="daily-quiz__cta">
              <p>Create an account to track your quiz history and learning progress!</p>
              <Link to="/register" className="daily-quiz__cta-btn">
                Create Free Account <FiArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default DailyQuiz;
