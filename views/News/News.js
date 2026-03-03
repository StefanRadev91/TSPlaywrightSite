'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FiExternalLink, FiClock, FiRss } from 'react-icons/fi';

function getSourceColor(source) {
  if (source.includes('Playwright')) return 'badge-green';
  if (source.includes('Ministry')) return 'badge-purple';
  return 'badge-blue';
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

  return (
    <div className="news-page">
      <div className="container">
        <div className="news-page__header">
          <span className="badge badge-green">
            <FiRss size={12} /> Live Feed
          </span>
          <h1 className="news-page__title">QA News</h1>
          <p className="news-page__subtitle">
            The latest articles and updates from the test automation community.
            Updated every 6 hours.
          </p>
        </div>

        {loading ? (
          <div className="news-page__loading">Loading articles...</div>
        ) : articles.length === 0 ? (
          <div className="news-page__empty">No articles available yet. Check back soon!</div>
        ) : (
          <div className="news-page__list">
            {articles.map(article => (
              <a
                key={article.id}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="news-item"
              >
                <div className="news-item__meta">
                  <span className={`badge ${getSourceColor(article.source)}`}>
                    {article.source}
                  </span>
                  <span className="news-item__date">
                    <FiClock size={12} />
                    {formatDate(article.date)}
                  </span>
                </div>
                <h3 className="news-item__title">
                  {article.title}
                  <FiExternalLink size={14} className="news-item__external" />
                </h3>
                {article.description && (
                  <p className="news-item__desc">{article.description}</p>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default News;
