const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());

// Dynamic import of fetch for CommonJS environment
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  console.log('Received search query:', query);

  try {
    const apiRes = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&limit=10`);
    const data = await apiRes.json();

    const results = data.results.map(track => ({
      id: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      previewUrl: track.previewUrl,
    }));

    res.json({ results });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Failed to fetch music data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
