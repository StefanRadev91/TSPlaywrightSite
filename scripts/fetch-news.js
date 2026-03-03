import { createHash } from 'crypto';
import admin from 'firebase-admin';
import Parser from 'rss-parser';

// Initialize Firebase Admin from GitHub secret
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

const FEEDS = [
  { url: 'https://feeds.feedburner.com/TestingCurator', source: 'Testing Curator' },
  { url: 'https://playwright.dev/feed.xml', source: 'Playwright Blog' },
  { url: 'https://www.ministryoftesting.com/feed', source: 'Ministry of Testing' },
];

const parser = new Parser();
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
        description: (item.contentSnippet || item.content || '').replace(/<[^>]*>/g, '').substring(0, 300).trim(),
      });
    }
    console.log(`Fetched ${result.items.length} articles from ${feed.source}`);
  } catch (err) {
    console.error(`Failed to fetch ${feed.source}: ${err.message}`);
  }
}

// Save articles to Firestore (doc ID = MD5 of link for deduplication)
if (articles.length > 0) {
  const batch = db.batch();
  for (const article of articles) {
    if (!article.link) continue;
    const id = createHash('md5').update(article.link).digest('hex');
    const ref = db.collection('news').doc(id);
    batch.set(ref, {
      title: article.title,
      link: article.link,
      source: article.source,
      date: admin.firestore.Timestamp.fromDate(article.date),
      description: article.description,
    }, { merge: true });
  }
  await batch.commit();
  console.log(`Saved ${articles.length} articles to Firestore.`);
}

// Delete articles older than 7 days
const cutoff = new Date();
cutoff.setDate(cutoff.getDate() - 7);

const oldDocs = await db.collection('news')
  .where('date', '<', admin.firestore.Timestamp.fromDate(cutoff))
  .get();

if (!oldDocs.empty) {
  const deleteBatch = db.batch();
  oldDocs.docs.forEach(doc => deleteBatch.delete(doc.ref));
  await deleteBatch.commit();
  console.log(`Deleted ${oldDocs.size} articles older than 7 days.`);
} else {
  console.log('No old articles to delete.');
}

console.log('Done.');
