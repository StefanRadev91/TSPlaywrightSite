'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiExternalLink, FiClock, FiRss, FiArrowUpRight } from 'react-icons/fi';

function getSourceColor(source) {
  if (source.includes('Playwright')) return 'badge-green';
  if (source.includes('Ministry')) return 'badge-purple';
  if (source.includes('InfoQ')) return 'badge-blue';
  if (source.includes('DevOps')) return 'badge-blue';
  return 'badge-green';
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const q = query(collection(db, 'news'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        setArticles(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate?.() || new Date(doc.data().date),
          }))
        );
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  // First article gets featured (large) card, rest get grid cards
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-page__header">
          <span className="badge badge-green">
            <FiRss size={12} /> Live Feed
          </span>
          <h1 className="news-page__title">QA News</h1>
          <p className="news-page__subtitle">
            Curated articles from the test automation community. Only QA-related content, updated every 6 hours.
          </p>
        </div>

        {loading ? (
          <div className="news-page__loading">
            <div className="news-page__spinner" />
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div className="news-page__empty">No articles available yet. Check back soon!</div>
        ) : (
          <>
            {/* Featured article */}
            <a
              href={featured.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-featured"
            >
              {featured.image && (
                <div className="news-featured__img-wrap">
                  <img src={featured.image} alt="" className="news-featured__img" />
                  <div className="news-featured__img-overlay" />
                </div>
              )}
              <div className="news-featured__body">
                <div className="news-featured__meta">
                  <span className={`badge ${getSourceColor(featured.source)}`}>
                    {featured.source}
                  </span>
                  <span className="news-featured__date">
                    <FiClock size={12} />
                    {formatDate(featured.date)}
                  </span>
                </div>
                <h2 className="news-featured__title">
                  {featured.title}
                  <FiArrowUpRight size={20} className="news-featured__arrow" />
                </h2>
                {featured.description && (
                  <p className="news-featured__desc">{featured.description}</p>
                )}
              </div>
            </a>

            {/* Grid of remaining articles */}
            {rest.length > 0 && (
              <div className="news-grid">
                {rest.map(article => (
                  <a
                    key={article.id}
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-grid__card"
                  >
                    {article.image ? (
                      <div className="news-grid__img-wrap">
                        <img src={article.image} alt="" className="news-grid__img" />
                      </div>
                    ) : (
                      <div className="news-grid__img-wrap news-grid__img-placeholder">
                        <FiExternalLink size={28} />
                      </div>
                    )}
                    <div className="news-grid__body">
                      <div className="news-grid__meta">
                        <span className={`badge ${getSourceColor(article.source)}`}>
                          {article.source}
                        </span>
                        <span className="news-grid__date">
                          <FiClock size={11} />
                          {formatDate(article.date)}
                        </span>
                      </div>
                      <h3 className="news-grid__title">{article.title}</h3>
                      {article.description && (
                        <p className="news-grid__desc">{article.description}</p>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default News;
