import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import DailyQuiz from '../../components/DailyQuiz/DailyQuiz';
import Logo from '../../components/Logo/Logo';
import { FiArrowRight, FiPlay, FiCode, FiLayers, FiCheckCircle, FiBookOpen, FiZap, FiTarget } from 'react-icons/fi';
import './Home.css';

function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__grid-pattern" />
        </div>
        <div className="hero__content container">
          <div className="hero__logo">
            <Logo />
          </div>
          <div className="hero__badge">
            <FiZap size={14} />
            Open Source Learning Platform
          </div>
          <h1 className="hero__title">
            Master <span className="hero__highlight-green">Playwright</span> &{' '}
            <span className="hero__highlight-blue">TypeScript</span>
          </h1>
          <p className="hero__subtitle">
            The complete guide to test automation. Go from zero experience to writing
            enterprise-level tests with the Page Object Model pattern.
          </p>
          <div className="hero__actions">
            <Link to="/typescript" className="hero__btn hero__btn--primary">
              Start Learning <FiArrowRight />
            </Link>
            <Link to="/playwright" className="hero__btn hero__btn--secondary">
              <FiPlay size={16} /> Explore Playwright
            </Link>
          </div>
          <div className="hero__stats">
            <div className="hero__stat">
              <span className="hero__stat-num">4</span>
              <span className="hero__stat-label">In-depth Guides</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">50+</span>
              <span className="hero__stat-label">Code Examples</span>
            </div>
            <div className="hero__stat">
              <span className="hero__stat-num">100%</span>
              <span className="hero__stat-label">Free & Open</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section (logged-in users only) */}
      {currentUser && (
        <section className="section">
          <div className="container">
            <ProgressBar />
          </div>
        </section>
      )}

      {/* Daily Quiz */}
      <section className="section">
        <div className="container">
          <DailyQuiz />
        </div>
      </section>

      {/* About Section */}
      <section className="about section">
        <div className="container">
          <div className="about__grid">
            <div className="about__text">
              <span className="badge badge-green">About This Site</span>
              <h2 className="about__title">Everything You Need to Start Test Automation</h2>
              <p>
                This site is built for anyone who wants to break into the world of automated testing.
                Whether you're a manual tester looking to level up, a developer wanting to add testing
                skills, or a complete beginner - this is your starting point.
              </p>
              <p>
                We cover the essential technologies and patterns used in real-world enterprise projects:
                Playwright for browser automation, TypeScript for type-safe code, and the Page Object
                Model for maintainable test architecture.
              </p>
              <p>
                By the end, you'll be able to set up a professional testing project from scratch and
                write your first enterprise-quality automated test.
              </p>
            </div>
            <div className="about__features">
              <div className="about__feature">
                <FiCheckCircle className="about__feature-icon" />
                <div>
                  <h4>Beginner Friendly</h4>
                  <p>No prior automation experience needed. We start from the basics.</p>
                </div>
              </div>
              <div className="about__feature">
                <FiBookOpen className="about__feature-icon" />
                <div>
                  <h4>Real Examples</h4>
                  <p>Every concept comes with practical, runnable code examples.</p>
                </div>
              </div>
              <div className="about__feature">
                <FiTarget className="about__feature-icon" />
                <div>
                  <h4>Enterprise Patterns</h4>
                  <p>Learn the same patterns used in production at top companies.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="paths section">
        <div className="container">
          <div className="paths__header">
            <span className="badge badge-blue">Learning Path</span>
            <h2 className="section-title">What You'll Learn</h2>
            <p className="section-subtitle">
              Follow our structured curriculum from fundamentals to advanced patterns
            </p>
          </div>

          <div className="paths__grid">
            <Link to="/typescript" className="path-card path-card--blue">
              <div className="path-card__number">01</div>
              <div className="path-card__icon">
                <FiCode size={28} />
              </div>
              <h3 className="path-card__title">TypeScript Fundamentals</h3>
              <p className="path-card__desc">
                Learn the TypeScript type system, interfaces, classes, generics, and async/await.
                The foundation for writing reliable test code.
              </p>
              <ul className="path-card__topics">
                <li>Basic & Advanced Types</li>
                <li>Interfaces & Type Aliases</li>
                <li>Classes & Inheritance</li>
                <li>Async/Await Patterns</li>
              </ul>
              <span className="path-card__link">
                Start TypeScript <FiArrowRight />
              </span>
            </Link>

            <Link to="/playwright" className="path-card path-card--green">
              <div className="path-card__number">02</div>
              <div className="path-card__icon">
                <FiPlay size={28} />
              </div>
              <h3 className="path-card__title">Playwright Essentials</h3>
              <p className="path-card__desc">
                Master browser automation with Playwright. Learn locators, interactions, assertions,
                and how to configure your test suite.
              </p>
              <ul className="path-card__topics">
                <li>Setup & Configuration</li>
                <li>Locators & Selectors</li>
                <li>Assertions & Waiting</li>
                <li>Screenshots & Reports</li>
              </ul>
              <span className="path-card__link">
                Start Playwright <FiArrowRight />
              </span>
            </Link>

            <Link to="/pom" className="path-card path-card--purple">
              <div className="path-card__number">03</div>
              <div className="path-card__icon">
                <FiLayers size={28} />
              </div>
              <h3 className="path-card__title">Page Object Model</h3>
              <p className="path-card__desc">
                Learn the industry-standard pattern for organizing test code. Build maintainable,
                scalable, and reusable test suites.
              </p>
              <ul className="path-card__topics">
                <li>POM Architecture</li>
                <li>Base Page Pattern</li>
                <li>Component Objects</li>
                <li>Enterprise Examples</li>
              </ul>
              <span className="path-card__link">
                Start POM <FiArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta section">
        <div className="container">
          <div className="cta__card">
            <h2 className="cta__title">Ready to Write Your First Test?</h2>
            <p className="cta__desc">
              Start with TypeScript basics and work your way up to enterprise-level test automation.
              Everything you need is right here.
            </p>
            <Link to="/typescript" className="hero__btn hero__btn--primary">
              Begin Your Journey <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
