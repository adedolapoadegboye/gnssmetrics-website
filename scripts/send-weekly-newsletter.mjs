import https from 'https';
import fs from 'fs';
import path from 'path';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const BUTTONDOWN_API_KEY = process.env.BUTTONDOWN_API_KEY;
const NEWS_DIR = './src/content/news';

// ── Helpers ───────────────────────────────────────────────────────────────────
function callApi(hostname, path, method, apiKey, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = https.request({
      hostname,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${apiKey}`,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function callClaude(prompt) {
  const body = JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  });
  const res = await new Promise((resolve, reject) => {
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
  if (res.status !== 200) throw new Error(`Claude API error ${res.status}: ${res.body}`);
  return JSON.parse(res.body).content[0].text;
}

function getArticlesFromLastWeek() {
  if (!fs.existsSync(NEWS_DIR)) return [];
  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const files = fs.readdirSync(NEWS_DIR)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse();

  const articles = [];
  for (const file of files) {
    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!dateMatch) continue;
    const date = new Date(dateMatch[1]);
    if (date < cutoff) break;
    const content = fs.readFileSync(path.join(NEWS_DIR, file), 'utf8');
    // Extract title and body from frontmatter
    const titleMatch = content.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : file;
    // Get body after second ---
    const parts = content.split('---');
    const body = parts.slice(2).join('---').trim();
    articles.push({ date: dateMatch[1], title, body });
  }
  return articles;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  if (!ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY not set'); process.exit(1); }
  if (!BUTTONDOWN_API_KEY) { console.error('BUTTONDOWN_API_KEY not set'); process.exit(1); }

  const articles = getArticlesFromLastWeek();
  console.log(`Found ${articles.length} articles from the past 7 days`);

  const weekStart = formatDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
  const weekEnd = formatDate(new Date().toISOString().slice(0, 10));

  let digestContent;

  if (articles.length === 0) {
    digestContent = `It was a quiet week across monitored GNSS news sources. No major developments to report. Check back next week.`;
  } else {
    const articleSummaries = articles.map((a, i) =>
      `${i + 1}. [${a.date}] ${a.title}\n${a.body.slice(0, 500)}`
    ).join('\n\n---\n\n');

    const prompt = `You are the editor of GNSSMetrics.com, a vendor-neutral community platform for GNSS engineers.

Here are the daily news digests from the past week (${weekStart} to ${weekEnd}):

${articleSummaries}

Write a weekly newsletter for GNSS engineers and industry professionals. Requirements:
- Start with a 2-3 sentence "Week in Review" opening that captures the overall theme of the week
- Group related stories into 2-4 thematic sections with short bold headers (e.g. "Constellation Updates", "Industry & Business", "Research & Technology", "Interference & Space Weather")
- Each section should have 2-4 sentences summarising the key developments
- End with a one-paragraph "Looking Ahead" section on what to watch next week
- Be technically precise, vendor-neutral, and concise
- Total length: 300-400 words
- Plain text only — no markdown, no bullet points, just paragraphs with bold section headers

First line should be the subject line for the email (max 8 words, punchy), followed by a blank line, then the newsletter body.`;

    console.log('Calling Claude to write weekly digest...');
    digestContent = await callClaude(prompt);
  }

  // Parse subject line from first line
  const lines = digestContent.split('\n').filter(l => l.trim());
  const subject = lines[0] || `GNSSMetrics Weekly — ${weekEnd}`;
  const body = lines.slice(1).join('\n\n').trim();

  // Format as clean HTML email
  const htmlBody = `
<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a; line-height: 1.7;">
  <div style="border-bottom: 2px solid #00d4aa; padding-bottom: 16px; margin-bottom: 24px;">
    <span style="font-family: Arial, sans-serif; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; color: #00d4aa; text-transform: uppercase;">GNSSMetrics</span>
    <span style="font-family: Arial, sans-serif; font-size: 13px; color: #888; margin-left: 8px;">${weekStart} — ${weekEnd}</span>
  </div>

  ${body
    .split('\n\n')
    .map(para => para.trim())
    .filter(Boolean)
    .map(para => `<p style="margin: 0 0 16px 0;">${para}</p>`)
    .join('\n')}

  <div style="border-top: 1px solid #ddd; margin-top: 32px; padding-top: 16px; font-family: Arial, sans-serif; font-size: 12px; color: #888;">
    <p style="margin: 0 0 6px 0;">You're receiving this because you subscribed at <a href="https://gnssmetrics.com" style="color: #00d4aa;">gnssmetrics.com</a>.</p>
    <p style="margin: 0;">Vendor-neutral · Community-driven · Open</p>
  </div>
</div>`;

  // Send via Buttondown API
  console.log('Sending newsletter via Buttondown...');
  const emailPayload = {
    subject,
    body: htmlBody,
    status: 'sent',
  };

  const res = await callApi(
    'api.buttondown.email',
    '/v1/emails',
    'POST',
    BUTTONDOWN_API_KEY,
    emailPayload
  );

  if (res.status === 201 || res.status === 200) {
    console.log(`✓ Newsletter sent: "${subject}"`);
  } else {
    console.error(`✗ Buttondown error ${res.status}: ${res.body}`);
    process.exit(1);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
