const express = require('express');
const shortid = require('shortid');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');

const app = express();
app.use(bodyParser.json());

const urlDatabase = {}; 

app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!validUrl.isUri(longUrl)) {
        return res.status(400).json({ error: 'Invalid URL' });
    }

    const shortUrl = shortid.generate();
    urlDatabase[shortUrl] = {
        longUrl,
        visits: 0,
        lastAccess: null
    };

    res.json({ shortUrl: `http://localhost:3000/${shortUrl}` });
});

app.get('/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;
    const urlEntry = urlDatabase[shortUrl];

    if (!urlEntry) {
        return res.status(404).json({ error: 'URL not found' });
    }

    urlEntry.visits += 1;
    urlEntry.lastAccess = new Date();

    res.redirect(301, urlEntry.longUrl);
});
app.get('/stats/:shortUrl', (req, res) => {
    const { shortUrl } = req.params;
    const urlEntry = urlDatabase[shortUrl];

    if (!urlEntry) {
        return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
        longUrl: urlEntry.longUrl,
        visits: urlEntry.visits,
        lastAccess: urlEntry.lastAccess
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
