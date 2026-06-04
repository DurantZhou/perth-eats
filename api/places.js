export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { name, suburb } = req.query;
  const query = encodeURIComponent(`${name} ${suburb} Perth WA`);
  const key = process.env.GOOGLE_API_KEY;
  try {
    const r = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,name,rating,photos&key=${key}`);
    const data = await r.json();
    const place = data.candidates?.[0];
    if (!place) return res.json({ photo: null, rating: null });
    const rating = place.rating || null;
    const ref = place.photos?.[0]?.photo_reference;
    const photo = ref ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=600&photoreference=${ref}&key=${key}` : null;
    res.json({ photo, rating });
  } catch(e) {
    res.json({ photo: null, rating: null });
  }
}