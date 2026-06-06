export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  const { query, cuisines, existing } = req.body;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': process.env.ANTHROPIC_KEY
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        messages: [{
          role: 'user',
          content: `Perth WA restaurant expert. User wants: "${query}". Return ONLY a JSON array (no markdown) of 20 real Perth restaurants. Each: {"name":"...","cuisine":"...","suburb":"...","price":1-4,"meal":["lunch","dinner","brunch"],"vibe":"max 8 words","rating":4.0-5.0}. price: 1=under $20,2=$20-40,3=$40-70,4=$70+. Cuisine from: ${cuisines}. Only real restaurants. Exclude: ${existing}.`
        }]
      })
    });
    const data = await r.json();
    const text = data.content?.map(b => b.text || '').join('').replace(/```json|```/g, '').trim();
    res.json(JSON.parse(text));
  } catch(e) {
    res.status(500).json({ error: 'Failed' });
  }
}