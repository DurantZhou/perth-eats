export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const { query, cuisines, existing } = req.body || {};
  const key = process.env.ANTHROPIC_KEY;

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': key
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: `Perth WA restaurant expert. User wants: "${query}". Return ONLY a valid JSON array, no markdown, no explanation, just the array. Include 10 real Perth restaurants. Each object must have exactly these fields: {"name":"string","cuisine":"string","suburb":"string","price":2,"meal":["dinner"],"vibe":"short description","rating":4.5}. Cuisine must be one of: ${cuisines}. Only exclude: ${existing}.`
        }]
      })
    });

    const data = await r.json();
    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }
    const text = data.content?.[0]?.text?.trim() || '[]';
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.status(200).json(parsed);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}