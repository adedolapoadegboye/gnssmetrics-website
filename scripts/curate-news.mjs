import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

// ── Config ────────────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CACHE_FILE = './news-cache.json';
const OUTPUT_DIR = './src/content/news';

const RSS_FEEDS = [
  // Technical & editorial
  { name: 'GPS World',        url: 'https://www.gpsworld.com/feed/' },
  { name: 'Inside GNSS',      url: 'https://insidegnss.com/feed/' },
  { name: 'NAVCEN',           url: 'https://www.navcen.uscg.gov/rss.xml' },
  { name: 'ESA Navigation',   url: 'https://www.esa.int/rssfeed/Navigation' },
  { name: 'ION News',         url: 'https://www.ion.org/rss.cfm' },
  { name: 'PhysOrg Space',    url: 'https://phys.org/rss-feed/space-news/' },
  { name: 'EurekAlert Tech',  url: 'https://www.eurekalert.org/rss/technology.xml' },
  // Academic
  { name: 'IEEE Aerospace',   url: 'https://ieeexplore.ieee.org/rss/TOC25.XML' },
  { name: 'USNO',             url: 'https://www.usno.navy.mil/USNO/rss/usno-rss.xml' },
  // Vendor technical blogs
  { name: 'Spirent Blog',     url: 'https://www.spirent.com/blogs/feed' },
  { name: 'NovAtel Blog',     url: 'https://novatel.com/rss' },
  { name: 'Trimble News',     url: 'https://news.trimble.com/rss' },
  // Business & industry intelligence
  { name: 'GPS Business News',  url: 'https://www.gps-business-news.com/feed/' },
  { name: 'Geospatial World',   url: 'https://www.geospatialworld.net/feed/' },
  { name: 'Space News',         url: 'https://spacenews.com/feed/' },
  { name: 'Via Satellite',      url: 'https://www.satellitetoday.com/feed/' },
  { name: 'Directions Mag',     url: 'https://www.directionsmag.com/rss' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'GNSSMetrics-NewsBot/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

function parseRSSItems(xml, sourceName) {
  const items = [];
  const itemMatches = xml.matchAll(/<item>([\s\S]*?)<\/item>/g);
  for (const match of itemMatches) {
    const block = match[1];
    const title   = (block.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                     block.match(/<title>(.*?)<\/title>/))?.[1]?.trim();
    const link    = (block.match(/<link>(.*?)<\/link>/) ||
                     block.match(/<link\s[^>]*href="([^"]+)"/))?.[1]?.trim();
    const pubDate = block.match(/<pubDate>(.*?)<\/pubDate>/)?.[1]?.trim();
    const desc    = (block.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
                     block.match(/<description>([\s\S]*?)<\/description>/))?.[1]
                     ?.replace(/<[^>]+>/g, '').replace(/&amp;/g,'&').replace(/&lt;/g,'<')
                     .replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'")
                     .trim().slice(0, 300);
    if (title && link) {
      items.push({ title, link, pubDate, desc: desc || '', source: sourceName });
    }
  }
  return items.slice(0, 5);
}

function isRecent(pubDateStr) {
  if (!pubDateStr) return true;
  try {
    const pub = new Date(pubDateStr);
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48h window
    return pub > cutoff;
  } catch { return true; }
}

function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); }
  catch { return { processed: [] }; }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

function slugify(str) {
  return str.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

async function callClaude(items) {
  const itemList = items.map((it, i) =>
    `${i+1}. [${it.source}] ${it.title}\n   ${it.desc}\n   URL: ${it.link}`
  ).join('\n\n');

  const prompt = `You are the editor of GNSSMetrics.com, a vendor-neutral community platform for GNSS engineers. 

Here are today's top GNSS news items from public sources:

${itemList}

Write a concise, technically accurate daily news digest for GNSS engineers. Requirements:
- Start with a single sentence summary of what is most significant today
- Cover each item in 2-3 sentences maximum
- Use precise technical language — your audience are engineers who know GNSS
- Be strictly vendor-neutral — do not favour any manufacturer
- Do not reproduce article text — summarise in your own words
- End with a one-line "Today in brief" summary of the day overall
- Plain text only, no markdown headers, no bullet points
- Total length: 150-250 words maximum

Also provide a short title for this digest (max 8 words) on the very first line, followed by a blank line, then the digest text.`;

  const body = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });

  const response = await new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  if (response.status !== 200) {
    throw new Error(`Claude API error ${response.status}: ${response.body}`);
  }

  const parsed = JSON.parse(response.body);
  return parsed.content[0].text;
}

function writeArticle(text, items, date) {
  const lines = text.split('\n').filter(l => l.trim());
  const title = lines[0] || 'Daily GNSS News Digest';
  const body  = lines.slice(1).join('\n\n').trim();

  const slug     = `${date}-${slugify(title)}`;
  const sources  = [...new Set(items.map(i => i.link))];
  const tags     = ['news', 'daily-digest'];

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, "'")}"`,
    `date: "${date}"`,
    `tags: [${tags.map(t => `"${t}"`).join(', ')}]`,
    `sources: [${sources.map(s => `"${s}"`).join(', ')}]`,
    `generated: true`,
    '---',
    '',
    `*AI-curated summary — sources linked above. Published automatically by GNSSMetrics news pipeline.*`,
    '',
    body,
  ].join('\n');

  const filePath = path.join(OUTPUT_DIR, `${slug}.md`);
  fs.writeFileSync(filePath, frontmatter);
  console.log(`✓ Written: ${filePath}`);
  return slug;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set');
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const cache = loadCache();
  const today = new Date().toISOString().slice(0, 10);

  // Check if we already ran today
  if (cache.processed.includes(today)) {
    console.log(`Already ran today (${today}). Skipping.`);
    process.exit(0);
  }

  // Fetch all feeds
  console.log('Fetching RSS feeds...');
  const allItems = [];
  for (const feed of RSS_FEEDS) {
    try {
      const xml = await fetchUrl(feed.url);
      const items = parseRSSItems(xml, feed.name).filter(i => isRecent(i.pubDate));
      console.log(`  ${feed.name}: ${items.length} recent items`);
      allItems.push(...items);
    } catch (e) {
      console.warn(`  ${feed.name}: failed (${e.message})`);
    }
  }

  if (!allItems.length) {
    console.log('No recent items found. Writing placeholder.');
    const placeholder = `No major GNSS news items were found in today's feeds. Check back tomorrow.\n\nToday in brief: Quiet day across monitored GNSS news sources.`;
    writeArticle(`Quiet Day in GNSS News\n\n${placeholder}`, [], today);
  } else {
    // Deduplicate by title similarity, take top 5
    const unique = allItems.filter((item, i, arr) =>
      arr.findIndex(x => x.title.slice(0,30) === item.title.slice(0,30)) === i
    ).slice(0, 5);

    console.log(`Sending ${unique.length} items to Claude...`);
    const digest = await callClaude(unique);
    writeArticle(digest, unique, today);
  }

  // Update cache
  cache.processed.push(today);
  // Keep only last 90 days in cache
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().slice(0,10);
  cache.processed = cache.processed.filter(d => d >= cutoff);
  saveCache(cache);

  console.log('Done.');
}

main().catch(e => { console.error(e); process.exit(1); });
