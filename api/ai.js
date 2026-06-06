export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { query, cuisines, existing } = req.body || {};
  if (!query) { res.status(400).json({ error: 'No query provided' }); return; }

  const key = process.env.ANTHROPIC_KEY;
  if (!key) { res.status(500).json({ error: 'API key not configured' }); return; }

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': key
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{
          role: 'user',
          content: `Perth WA restaurant expert. User wants: "${query}". Return ONLY a JSON array (no markdown, no backticks) of 20 real Perth restaurants. Each object: {"name":"...","cuisine":"...","suburb":"...","price":1-4,"meal":["lunch","dinner","brunch"],"vibe":"max 8 words","rating":4.0-5.0}. price: 1=under $20, 2=$20-40, 3=$40-70, 4=$70+. Cuisine from: ${cuisines || 'Japanese,Modern Australian,Asian,Italian,Mexican,Thai,Vietnamese,Indian,French,Greek,Middle Eastern,Latin American,Cafe / Brunch,Other'}. Only real known Perth restaurants. Exclude: ${existing || ''}.`
        }]
      })
    });
    const data = await r.json();
    const text = data.content?.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}