import { createHash } from 'crypto';
import admin from 'firebase-admin';
import Parser from 'rss-parser';

// Initialize Firebase Admin from GitHub secret
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// Only direct-source feeds (no aggregators that link to random external blogs)
const FEEDS = [
  { url: 'https://feed.infoq.com/?contentType=article&tag=testing', source: 'InfoQ' },
  { url: 'https://www.softwaretestingmagazine.com/feed/', source: 'ST Magazine' },
  { url: 'https://dev.to/feed/playwright', source: 'Playwright' },
  { url: 'https://devops.com/feed/', source: 'DevOps.com' },
];

// Only keep articles related to QA / testing / automation
const QA_KEYWORDS = [
  'test', 'testing', 'qa ', 'quality assurance', 'automation', 'automate',
  'playwright', 'selenium', 'cypress', 'e2e', 'end-to-end',
  'bug', 'regression', 'flaky', 'ci/cd', 'continuous integration',
  'devops', 'shift-left', 'tdd', 'bdd', 'cucumber',
  'performance test', 'load test', 'api test', 'unit test',
  'integration test', 'smoke test', 'sanity', 'test plan',
  'test case', 'test strategy', 'code coverage', 'assertion',
  'locator', 'page object', 'fixture', 'mock', 'stub',
  'postman', 'k6', 'jmeter', 'appium', 'webdriver',
  'sdet', 'qe ', 'quality engineer', 'test engineer',
  'typescript', 'browser automation', 'accessibility', 'a11y',
  'visual regression', 'screenshot', 'trace', 'reporter',
];

function isQARelated(article) {
  const text = `${article.title} ${article.description}`.toLowerCase();
  return QA_KEYWORDS.some(kw => text.includes(kw));
}

const parser = new Parser({
  customFields: {
    item: [
      ['content:encoded', 'contentEncoded'],
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

// Extract the first image URL from HTML content
function extractImage(item) {
  // 1. Check media:content or media:thumbnail
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;

  // 2. Check enclosure
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image')) return item.enclosure.url;

  // 3. Parse <img> from full HTML content (contentEncoded has the raw HTML)
  const html = item.contentEncoded || item.content || item.description || '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]) return imgMatch[1];

  return '';
}

const articles = [];

// Fetch all feeds (errors per feed don't block others)
for (const feed of FEEDS) {
  try {
    const result = await parser.parseURL(feed.url);
    for (const item of result.items) {
      const rawDate = item.isoDate ? new Date(item.isoDate) : new Date(item.pubDate);
      articles.push({
        title: (item.title || '').trim(),
        link: (item.link || '').trim(),
        source: feed.source,
        date: isNaN(rawDate.getTime()) ? new Date() : rawDate,
        description: (item.contentSnippet || item.content || '').replace(/<[^>]*>/g, '').substring(0, 200).trim(),
        image: extractImage(item),
      });
    }
    console.log(`Fetched ${result.items.length} articles from ${feed.source}`);
  } catch (err) {
    console.error(`Failed to fetch ${feed.source}: ${err.message}`);
  }
}

// Filter to QA-related articles only
const qaArticles = articles.filter(isQARelated);
console.log(`${qaArticles.length}/${articles.length} articles matched QA filter.`);

// Sort by date descending and keep only the 10 most recent
qaArticles.sort((a, b) => b.date - a.date);
const top10 = qaArticles.slice(0, 10);

// Clear existing news collection and replace with fresh top 10
const existingDocs = await db.collection('news').get();
if (!existingDocs.empty) {
  const clearBatch = db.batch();
  existingDocs.docs.forEach(doc => clearBatch.delete(doc.ref));
  await clearBatch.commit();
  console.log(`Cleared ${existingDocs.size} old articles.`);
}

// Save fresh articles
if (top10.length > 0) {
  const batch = db.batch();
  for (const article of top10) {
    if (!article.link) continue;
    const id = createHash('md5').update(article.link).digest('hex');
    const ref = db.collection('news').doc(id);
    batch.set(ref, {
      title: article.title,
      link: article.link,
      source: article.source,
      date: admin.firestore.Timestamp.fromDate(article.date),
      description: article.description,
      image: article.image,
    });
  }
  await batch.commit();
  console.log(`Saved ${top10.length} QA articles to Firestore.`);
}

console.log('Done.');
